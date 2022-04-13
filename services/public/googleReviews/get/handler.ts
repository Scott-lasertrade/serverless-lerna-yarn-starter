import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import axios from 'axios';

export async function task() {
    const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJ16Xd5zBd1moRmBKhluMfpwU&fields=name%2Crating%2Cformatted_phone_number%2Creviews&key=AIzaSyD8Y3BUjBKoVf3wR1dwJCM90EJVKDC1WDU`
    );

    const response = {
        statusCode: 200,
        body: data,
    };
    return response;
}

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(), context);
};

export const main = middyfy(handler);
