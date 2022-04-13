import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { AppError } from '@medii/common';
import { Database, Category } from '@medii/data';
import { Connection, EntityManager, TypeORMError } from 'typeorm';
import schema from './schema';

const PG_UNIQUE_CONSTRAINT_VIOLATION = '23505';

const database = new Database();

const updateChildren = async (
    transactionalEntityManager: EntityManager,
    parent: Category,
    previousKey: string
) => {
    const childCategories = (
        await transactionalEntityManager.query(
            `
        WITH RECURSIVE cteGetChildren AS (
            SELECT id, name, key
            FROM category
            WHERE id = $1
            UNION ALL
                SELECT ct.id, ct.name, ct.key
                FROM category ct
                    JOIN cteGetChildren ON ct.parent_id = cteGetChildren.id
            ), keyToRemove as (select key from cteGetChildren where id = $1)
            SELECT ct.id, ct.name, ct.key
            FROM cteGetChildren  ct
            where id != $1;
    `,
            [parent.id]
        )
    ).map((res) => {
        console.log(res);
        const category = new Category(res.id);
        category.key = parent.key + res.key.replace(previousKey, '');
        return category;
    });
    await Promise.all(
        childCategories.map(async (cat) => {
            console.log(cat);
            const categoryRepository =
                transactionalEntityManager.getRepository(Category);
            return await categoryRepository.save(cat);
        })
    );
};

const task = async (event) => {
    console.log(event.body);
    const id = event.body.id;
    const name = event.body.name;
    const parentId = event.body.parentId;

    const dbConn: Connection = await database.getConnection();
    let category: Category;
    let categoryKey: string;

    if (id) {
        category = await dbConn
            .createQueryBuilder(Category, 'category')
            .where('id = :id', { id: id })
            .getOneOrFail();
        categoryKey = category.key;
    } else {
        category = new Category();
        category.created_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;
    }
    category.updated_by =
        event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;
    category.name = name;

    if (parentId) {
        const parent = await dbConn
            .createQueryBuilder(Category, 'category')
            .where('id = :id', { id: parentId })
            .getOneOrFail();
        category.parent_id = parentId;
        category.parent = parent;
        category.key = parent.key + '|' + name.toLowerCase().replace(' ', '_');
    } else {
        category.parent_id = undefined;
        category.key = name.toLowerCase().replace(' ', '_');
    }

    try {
        await dbConn.transaction(async (transactionalEntityManager) => {
            const categoryRepository =
                transactionalEntityManager.getRepository(Category);
            console.log('Saving category...');
            category = await categoryRepository.save(category);
            console.log('Saved category', Category);

            if (categoryKey) {
                await updateChildren(
                    transactionalEntityManager,
                    category,
                    categoryKey
                );
            }
        });
    } catch (err) {
        console.log(err);
        // TODO - S.Y: How do I make this type safe?
        // if (err && err?.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        //     throw new AppError(
        //         `Category must have unique children. SEE - ${
        //             err?.detail ?? ''
        //         }}`,
        //         400
        //     );
        // } else {
        //     throw err;
        // }
        throw err;
    }

    return category;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
