import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { middyfy } from '@medii/api-lambda';
import { Database } from '@medii/data';

const database = new Database();

const handler: any = async (event) => {
    console.log(event);
    try {
        let dbConn = await database.getConnection();
        console.log('Running Migrations...');
        const migrationResult = await dbConn.runMigrations();
        console.log('Migrations: ', migrationResult);

        return {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*',
            },
            statusCode: 200,
            body: JSON.stringify(migrationResult),
        };
    } catch (e: any) {
        console.log(e);
        return {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*',
            },
            statusCode: 400,
            body: JSON.stringify({
                message: 'Failed to handle migrations',
                error: e,
            }),
        };
    }
};

export const main = middyfy(handler);
