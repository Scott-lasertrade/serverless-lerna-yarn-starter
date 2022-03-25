import type { ValidatedEventAPIGatewayProxyEvent } from '@shared/apiGateway';
import Database from '@shared/database';
import { middyfy, handleTimeout } from '@shared/lambda';
import 'source-map-support/register';
import { Category } from '@entities';
import schema from './schema';
import 'typeorm-aurora-data-api-driver';
import { Connection, DeleteResult } from 'typeorm';
const database = new Database();

const task = async (event) => {
    const id = event.body.id;
    let deletedCategories: DeleteResult[];

    const dbConn: Connection = await database.getConnection();
    await dbConn.transaction(async (transactionalEntityManager) => {
        const childCategories: Category[] = (
            await transactionalEntityManager.query(
                `
                WITH RECURSIVE cteGetChildren AS (
                SELECT id, key, length(key) - length(REPLACE(key,'|','')) as depth
                FROM category
                WHERE id = $1
                UNION ALL
                    SELECT ct.id, ct.key, length(ct.key) - length(REPLACE(ct.key,'|','')) as depth
                    FROM category ct
                        JOIN cteGetChildren ON ct.parent_id = cteGetChildren.id
                ), keyToRemove as (select key from cteGetChildren where id = $1)
                select * from cteGetChildren
                order by depth desc
            `,
                [id]
            )
        ).map((res) => {
            const category = new Category(res.id);
            return category;
        });
        deletedCategories = await Promise.all(
            childCategories.map(async (cat: Category) => {
                const categoryRepository =
                    transactionalEntityManager.getRepository(Category);
                return await categoryRepository.delete(cat);
            })
        );
    });

    return deletedCategories;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
