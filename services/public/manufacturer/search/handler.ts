import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import {
    Database,
    ManufacturerFuzzySearchView,
    ManufacturerSearchView,
} from '@medii/data';

const database = new Database();

const task = async (event) => {
    const searchTerm = event.pathParameters.searchTerm;

    if (!searchTerm) {
        return [];
    }
    const dbConn = await database.getConnection();

    const formattedSearch = searchTerm.trim().replace(/ /g, ':* | ');

    let searchResults = await dbConn
        .createQueryBuilder(ManufacturerSearchView, 'manufacturer_search_view')
        .where(`document @@ to_tsquery(:searchQuery)`, {
            searchQuery: formattedSearch,
        })
        .orderBy(
            `ts_rank_cd(document, to_tsquery('${formattedSearch}'))`,
            'DESC',
            'NULLS LAST'
        )
        .orderBy(`name`, 'ASC')
        .getMany();

    if (!searchResults || searchResults.length == 0) {
        console.log(`Could not search for ${searchTerm} on Manufacturer.name.`);
        console.log('Attempt Fuzzy search logic');

        const searchTerms = searchTerm.split(/ /g);

        const results = await Promise.all(
            searchTerms.map((term) => {
                return dbConn
                    .createQueryBuilder(
                        ManufacturerFuzzySearchView,
                        'manufacturer_fuzzy_search_view'
                    )
                    .where(`similarity(word, :searchTerm) >= 0.3`, {
                        searchTerm: term,
                    })
                    .orderBy(`word <-> '${term}'`, 'DESC', 'NULLS LAST')
                    .getOne();
            })
        );

        if (results && results.length > 0 && results[0] != undefined) {
            const formattedSearch = results
                .map((res: { word: string }) => res.word)
                .join(':* | ');

            searchResults = await dbConn
                .createQueryBuilder(
                    ManufacturerSearchView,
                    'manufacturer_search_view'
                )
                .where(`document @@ to_tsquery(:searchQuery)`, {
                    searchQuery: formattedSearch,
                })
                .getMany();
        }
    }

    if (!searchResults || searchResults.length == 0) {
        console.log(
            `Could not fuzzy search for ${searchTerm} on Manufacturer.name.`
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
export const main = middyfy(handler);
