import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Address, Account, AddressType, Country } from '@medii/data';
import schema from './schema';

const database = new Database();

// TODO - S.Y Convert to new functionality if reintroduced
const task = async (event) => {
    const post_code = event.body.post_code;
    const address_line_1 = event.body.address_line_1;
    const state = event.body.state;
    const address_line_2 = event.body.address_line_2;
    const country = event.body.country;
    const tax_id = event.body.tax_id;
    const business_name = event.body.business_name;
    const account_id = event.body.account_id;

    const suburb = event.body.suburb;
    let response;
    const dbConn = await database.getConnection();

    await dbConn.transaction(async (transactionalEntityManager) => {
        const accountRepository =
            transactionalEntityManager.getRepository(Account);
        const addressTypeRepository =
            transactionalEntityManager.getRepository(AddressType);
        let account: Account = new Account();
        if (account_id) {
            account = await accountRepository.findOneOrFail(account_id, {
                relations: ['address'],
            });
            console.log('Retrieved Account', account);
        }
        let newAddress: Address;
        if (account) {
            newAddress = account.address;
        } else {
            newAddress = new Address();
            newAddress.created_by =
                event.headers.AuthorizedUserId ??
                event.headers.authorizeduserid;
        }
        newAddress.post_code = post_code;
        newAddress.address_line_1 = address_line_1;
        newAddress.state = state;
        newAddress.address_line_2 = address_line_2;
        newAddress.country = new Country(country);
        newAddress.suburb = suburb;
        if (account) {
            newAddress.address_type = await addressTypeRepository.findOneOrFail(
                1
            );
        } else {
            newAddress.address_type = await addressTypeRepository.findOneOrFail(
                2
            );
        }
        console.log(newAddress);
        newAddress.updated_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;
        const savedAddress = await transactionalEntityManager
            .getRepository(Address)
            .save(newAddress);
        if (account) {
            account.business_name = business_name;
            account.tax_id = tax_id;
            account.address = new Address(savedAddress.id);
            response = await transactionalEntityManager
                .getRepository(Account)
                .save(account);
        }
    });

    return { response };
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
