import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Category } from '@medii/data';
import { AppError } from '@medii/common';

const database = new Database();

const getRecursive = async (categoryArray, dbConn) => {
    return categoryArray.map(async (categoryItem) => {
        let newItems;
        const categorySub = await dbConn
            .createQueryBuilder(Category, 'c')
            .innerJoinAndSelect('c.parent', 'cc')
            .where('cc.id = :id', { id: categoryItem.id })
            .getMany();
        console.log(categorySub);
        if (categorySub?.length > 0) {
            newItems = await getRecursive(categorySub, dbConn);
        }
        return categorySub;
    });
};

const task = async (event: any) => {
    const id = event.pathParameters.id;
    if (!Number(id)) {
        throw new AppError(`Incorrect id format provided - ${id}`, 400);
    }
    let newItems;
    const dbConn = await database.getConnection();
    const category = await dbConn
        .createQueryBuilder(Category, 'c')
        .leftJoinAndSelect('c.parent', 'cc')
        .where('c.id = :id', { id: id })
        .getOne();
    const categorySub = [category];
    console.log(categorySub);

    // const categorySub = await dbConn
    //     .createQueryBuilder(Category, 'c')
    //     .innerJoinAndSelect('c.parent', 'cc')
    //     .where('cc.id = :id', { id: id })
    //     .getMany();
    // if (categorySub?.length > 0) {
    newItems = await getRecursive(categorySub, dbConn);
    // }
    return { category, categorySub, newItems };
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
