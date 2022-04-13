import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import {
    Database,
    ProductFuzzySearchView,
    ProductSearchView,
} from '@medii/data';

const database = new Database();

const task = async (event) => {
    const searchTerm = event.pathParameters.searchTerm;

    if (!searchTerm) {
        return [];
    }
    const dbConn = await database.getConnection();
    const formattedSearch = searchTerm.trim().replace(/ /g, ':* & ') + ':*';

    console.log(`Searching against: ${formattedSearch}`);

    let searchResults = await dbConn
        .createQueryBuilder(ProductSearchView, 'product_search_view')
        .where(`document @@ to_tsquery(:searchQuery)`, {
            searchQuery: formattedSearch,
        })
        .orderBy(
            `ts_rank_cd(document, to_tsquery('${formattedSearch}'))`,
            'DESC',
            'NULLS LAST'
        )
        .orderBy(`title`, 'ASC')
        .getMany();

    if (!searchResults || searchResults.length == 0) {
        console.log(
            `Could not search for ${searchTerm} on Product.name or Manufacturer.name.`
        );
        console.log('Attempt Fuzzy search logic');

        const searchTerms = searchTerm.split(/ /g);

        const searchTermPromises = searchTerms.map((term) => {
            return dbConn
                .createQueryBuilder(
                    ProductFuzzySearchView,
                    'product_fuzzy_search_view'
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
                results.map((res: { word: string }) => res.word).join(':* & ') +
                ':*';

            console.log(`Searching against: ${formattedSearch}`);

            searchResults = await dbConn
                .createQueryBuilder(ProductSearchView, 'product_search_view')
                .where(`document @@ to_tsquery(:searchQuery)`, {
                    searchQuery: formattedSearch,
                })
                .orderBy(
                    `ts_rank_cd(document, to_tsquery('${formattedSearch}'))`,
                    'DESC',
                    'NULLS LAST'
                )
                .orderBy(`title`, 'ASC')
                .getMany();
        }
    }

    if (!searchResults || searchResults.length == 0) {
        console.log(
            `Could not fuzzy search for ${searchTerm} on Product.name or Manufacturer.name.`
        );
    }

    return { searchResults: searchResults };
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};
export const main: any = middyfy(handler);
