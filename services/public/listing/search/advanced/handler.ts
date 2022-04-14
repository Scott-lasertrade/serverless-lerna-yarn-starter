import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, LiveListingsFuzzySearchView } from '@medii/data';
import schema from './schema';

const database = new Database();

const buildWhereCondition = (
    searchTerm: string,
    categoryKey: string,
    manufacturer: string,
    min: number,
    max: number,
    showOutOfStock: boolean,
    parameterList: any[]
) => {
    let whereConditions = '';

    if (searchTerm) {
        if (whereConditions === '') {
            whereConditions += 'WHERE ';
        } else {
            whereConditions += ' AND ';
        }
        whereConditions += `document @@ to_tsquery($${
            parameterList.length + 1
        })`;
        parameterList.push(searchTerm);
    }
    if (categoryKey) {
        if (whereConditions === '') {
            whereConditions += 'WHERE ';
        } else {
            whereConditions += ' AND ';
        }
        whereConditions += `(category in (select id from cteGetChildren))`;
    }
    if (manufacturer) {
        if (whereConditions === '') {
            whereConditions += 'WHERE ';
        } else {
            whereConditions += ' AND ';
        }
        whereConditions += `manufacturer = $${parameterList.length + 1}`;
        parameterList.push(manufacturer);
    }
    if (min) {
        if (whereConditions === '') {
            whereConditions += 'WHERE ';
        } else {
            whereConditions += ' AND ';
        }
        whereConditions += `price >= $${parameterList.length + 1}`;
        parameterList.push(min);
    }
    if (max) {
        if (whereConditions === '') {
            whereConditions += 'WHERE ';
        } else {
            whereConditions += ' AND ';
        }
        whereConditions += `price <= $${parameterList.length + 1}`;
        parameterList.push(max);
    }
    if (whereConditions === '') {
        whereConditions += 'WHERE ';
    } else {
        whereConditions += ' AND ';
    }
    whereConditions += showOutOfStock
        ? "status = 'Sold'"
        : "status =  'Listed'";
    return whereConditions;
};

const buildRowPaginationOrderBy = (
    orderBy: string,
    orderDescending: boolean,
    searchQuery: string,
    parameterList: any[]
) => {
    let orderByConditions = 'DENSE_RANK() over(order by ';
    switch (orderBy) {
        case 'price':
            orderByConditions += 'price';
            if (orderDescending) {
                orderByConditions += ' DESC';
            }
            break;
        case 'year':
            orderByConditions += '"YOM"';
            if (orderDescending) {
                orderByConditions += ' DESC';
            }
            break;
        case 'recent':
            orderByConditions += 'extract(epoch from created_on)';
            if (orderDescending) {
                orderByConditions += ' DESC';
            }
            break;
        default:
            orderByConditions += `ts_rank_cd(document, to_tsquery(${
                searchQuery ? '$' + (parameterList.length + 1) : null
            })) DESC`;
            if (searchQuery) {
                parameterList.push(searchQuery);
            }
            break;
    }
    orderByConditions += ', id';
    orderByConditions += ') as sort_id';
    return orderByConditions;
};

const buildOrderBy = (
    orderBy: string,
    orderDescending: boolean,
    searchQuery: string,
    parameterList: any[]
) => {
    let orderByConditions = 'ORDER BY ';
    switch (orderBy) {
        case 'price':
            orderByConditions += 'price';
            break;
        case 'year':
            orderByConditions += '"YOM"';
            break;
        case 'recent':
            orderByConditions += 'extract(epoch from created_on)';
            break;
        default:
            orderByConditions += `ts_rank_cd(document, to_tsquery(${
                searchQuery ? '$' + (parameterList.length + 1) : null
            })) DESC`;
            if (searchQuery) {
                parameterList.push(searchQuery);
            }
            break;
    }

    if (orderDescending) {
        orderByConditions += ' DESC';
    }
    return orderByConditions;
};

const task = async (event) => {
    const categoryKey = event.body.categoryKey;
    const manufacturer = event.body.manufacturer;
    const searchTerm = event.body.searchTerm;
    const min = event.body.min;
    const max = event.body.max;
    const orderBy = event.body.orderBy;
    const orderDescending = event.body.orderDescending;
    const lastId = event.body.lastId ?? 0;
    const previousPage = event.body.previousPage;
    const limit = event.body.limit;
    const showOutOfStock = event.body.showOutOfStock;
    const dbConn = await database.getConnection();
    let searchResults = [];

    console.log('Searching against: ', searchTerm);
    const performAdvancedSearch = async (searchQuery: string) => {
        let parameterList: string[] = [];
        const paginationOrder = buildRowPaginationOrderBy(
            orderBy,
            orderDescending,
            searchQuery,
            parameterList
        );
        const whereConditions = buildWhereCondition(
            searchQuery,
            categoryKey,
            manufacturer,
            min,
            max,
            showOutOfStock,
            parameterList
        );
        const orderByConditions = buildOrderBy(
            orderBy,
            orderDescending,
            searchQuery,
            parameterList
        );

        let query = '';
        if (categoryKey) {
            query = `WITH RECURSIVE cteGetChildren AS (
                    SELECT id, name, key
                    FROM category
                    WHERE id = (select id from category where key = $${
                        parameterList.length + 1
                    })
                    UNION ALL
                        SELECT ct.id, ct.name, ct.key
                        FROM category ct
                            JOIN cteGetChildren ON ct.parent_id = cteGetChildren.id
                    ), keyToRemove as (select key from cteGetChildren where id = (select id from category where key = $${
                        parameterList.length + 1
                    }))
                    `;
            parameterList.push(categoryKey);
        }
        query += `select *, count(*) OVER() AS full_count from (select id, 
                        "productId", 
                        (select "YOM" || ' ' || coalesce((string_agg(man.name, ' ')), '') from manufacturer man inner join product_to_manufacturer ptm2 on man.id = ptm2.manufacturer where ptm2.product = "productId" group by ptm2.product) || ' ' || "productName" as title,
                        price,
                        thumbnail_key,
                        thumbnail_bucket,
                        thumbnail_region,
                        created_on,
                        
                        ${paginationOrder}
                    from (
                        select * from live_listings_advanced_view 
                        ${whereConditions}
                    ) as nested
                    group by id, "productId", price, "YOM", "productName", thumbnail_key, thumbnail_bucket, thumbnail_region, document, created_on, manufacturer
                ${orderByConditions}) as searchResults
                where sort_id ${previousPage ? '<' : '>'} $${
            parameterList.length + 1
        }
                group by id, "productId", price, title, thumbnail_key, thumbnail_bucket, thumbnail_region, created_on, sort_id
                order by sort_id ${previousPage ? 'DESC' : 'ASC'}
                limit $${parameterList.length + 2}`;

        parameterList.push(lastId);
        parameterList.push(limit);
        console.log(parameterList, query);

        return (await dbConn.query(query, parameterList)).map((res) => {
            console.log(res);
            return res;
        });
    };

    if (!searchTerm) {
        searchResults = await performAdvancedSearch('');
    } else {
        const formattedSearch = searchTerm.trim().replace(/ /g, ':* | ') + ':*';

        searchResults = await performAdvancedSearch(formattedSearch);

        if (!searchResults || searchResults.length == 0) {
            console.log(
                `Could not search for ${searchTerm} on Listing.YOM or Product.name or Manufacturer.name.`
            );
            console.log('Attempt Fuzzy search logic');

            const searchTerms = searchTerm.split(/ /g);

            const searchTermPromises = searchTerms.map((term) => {
                return dbConn
                    .createQueryBuilder(
                        LiveListingsFuzzySearchView,
                        'live_listing_fuzzy_search_view'
                    )
                    .where(`similarity(word, :searchTerm) >= 0.3`, {
                        searchTerm: term,
                    })
                    .orderBy(`word <-> '${term}'`, 'DESC', 'NULLS LAST')
                    .getOne();
            });

            const results = await Promise.all(searchTermPromises);
            if (results && results.length > 0 && results[0] != undefined) {
                const formattedSearch =
                    results
                        .map((res: { word: string }) => res.word)
                        .join(':* | ') + ':*';
                searchResults = await performAdvancedSearch(formattedSearch);
            }
        }

        if (!searchResults || searchResults.length == 0) {
            console.log(
                `Could not fuzzy search for ${searchTerm} on Product.name or Manufacturer.name.`
            );
        }
    }
    return searchResults;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};
export const main: any = middyfy(handler);
