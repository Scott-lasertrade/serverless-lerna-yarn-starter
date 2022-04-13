import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, User } from '@medii/data';

const database = new Database();

const task = async (event) => {
    console.log(event);

    const dbConn = await database.getConnection();
    const { cogid } = event.pathParameters;
    const user = await dbConn
        .createQueryBuilder(User, 'u')
        .innerJoinAndSelect('u.accounts', 'a')
        .leftJoinAndSelect('a.address', 'ad')
        .leftJoinAndSelect('ad.country', 'c')
        .leftJoinAndSelect('ad.address_type', 'adtype')
        .where('u.cognito_user_id = :cogId', {
            cogId: cogid,
        })
        .getOneOrFail();

    return { user };
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
