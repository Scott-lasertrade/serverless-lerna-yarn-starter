import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Category } from '@medii/data';
import schema from './schema';

const database = new Database();

const task = async (event: any) => {
    const key = event.body.key;
    console.log(`Using Key [${key}]`);

    const dbConn = await database.getConnection();
    const categories = (
        await dbConn.query(
            `
            with cteKey as (
                (select id, parent_id from category where key = $1)
            )
            SELECT id, name, parent_id, key, length(key) - length(REPLACE(key,'|','')) as depth
            FROM category
            WHERE id = (select parent_id from cteKey)
            UNION
            SELECT id, name, parent_id, key, length(key) - length(REPLACE(key,'|','')) as depth
            FROM category
            WHERE key = $1
            UNION
            SELECT ct.id, ct.name, ct.parent_id, ct.key, length(ct.key) - length(REPLACE(ct.key,'|','')) as depth
            FROM category ct
            where parent_id = (select id from cteKey)
            order by depth, name
        `,
            [key]
        )
    ).map((res) => {
        let category = new Category(res.id);
        category.key = res.key;
        category.name = res.name;
        category.parent_id = res.parent_id;
        return category;
    });
    return categories;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
