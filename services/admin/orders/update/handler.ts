import 'source-map-support/register';
import schema from './schema';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { getTaxFromLineItems } from '@medii/payment';
import {
    Database,
    Address,
    Country,
    LineItem,
    Order,
    OrderBuyerDetails,
} from '@medii/data';
import { AppError } from '@medii/common';

const database = new Database();

const task = async (event) => {
    if (!Number(event.pathParameters.id)) {
        throw new AppError(
            `Incorrect id format provided - ${event.pathParameters.id}`,
            400
        );
    }
    const id = Number(event.pathParameters.id);
    const dbConn = await database.getConnection();
    const orderAbn = event.body.orderAbn ?? undefined;
    const orderBusinessName = event.body.orderBusinessName ?? undefined;
    const orderAddress = event.body.orderAddress ?? undefined;
    const listingAddress = event.body.listingAddress ?? undefined;
    const shippingFee = event.body.shippingFee ?? undefined;
    const includeGST = event.body.includeGST;

    console.log(`ORDER|UPDATE - [${id}]`);
    let orderToUpdate = await dbConn
        .createQueryBuilder(Order, 'order')
        .innerJoinAndSelect('order.line_items', 'li')
        .innerJoinAndSelect('order.buyer', 'buyer')
        .innerJoinAndSelect('order.status', 'os')
        .innerJoinAndSelect('li.type', 'lit')
        .innerJoinAndSelect('order.checkout', 'checkout')
        .innerJoinAndSelect('order.listing', 'l')
        .innerJoinAndSelect('l.address', 'laddr')
        .innerJoinAndSelect('laddr.country', 'lc')
        .innerJoinAndSelect('checkout.buyer_details', 'obd')
        .innerJoinAndSelect('obd.address', 'address')
        .innerJoinAndSelect('address.country', 'c')
        .where('order.id = :orderId', { orderId: id })
        .getOneOrFail();

    await dbConn.transaction(async (transactionalEntityManager) => {
        console.log('*** START TRANSACTION ***');

        if (orderAbn || orderBusinessName) {
            const orderDetails = orderToUpdate.checkout.buyer_details;

            orderDetails.business_name = orderBusinessName;
            orderDetails.tax_id = orderAbn;
            orderDetails.updated_by =
                event.headers.AuthorizedUserId ??
                event.headers.authorizeduserid;
            await transactionalEntityManager
                .getRepository(OrderBuyerDetails)
                .save(orderDetails);
        }

        if (orderAddress) {
            const addressToUpdate =
                orderToUpdate.checkout.buyer_details.address;
            addressToUpdate.address_line_1 = orderAddress.addressLine1;
            addressToUpdate.address_line_2 = orderAddress.addressLine2;
            addressToUpdate.suburb = orderAddress.suburb;
            addressToUpdate.state = orderAddress.state;
            addressToUpdate.post_code = orderAddress.postcode;
            addressToUpdate.country = await transactionalEntityManager
                .createQueryBuilder(Country, 'c')
                .where('c.abbreviation = :country', {
                    country: orderAddress.country,
                })
                .getOneOrFail();

            addressToUpdate.updated_by =
                event.headers.AuthorizedUserId ??
                event.headers.authorizeduserid;
            await transactionalEntityManager
                .getRepository(Address)
                .save(addressToUpdate);
        }

        if (listingAddress) {
            const addressToUpdate = orderToUpdate.listing.address;
            addressToUpdate.address_line_1 = listingAddress.addressLine1;
            addressToUpdate.address_line_2 = listingAddress.addressLine2;
            addressToUpdate.suburb = listingAddress.suburb;
            addressToUpdate.state = listingAddress.state;
            addressToUpdate.post_code = listingAddress.postcode;
            addressToUpdate.country = await transactionalEntityManager
                .createQueryBuilder(Country, 'c')
                .where('c.abbreviation = :country', {
                    country: listingAddress.country,
                })
                .getOneOrFail();

            addressToUpdate.updated_by =
                event.headers.AuthorizedUserId ??
                event.headers.authorizeduserid;
            await transactionalEntityManager
                .getRepository(Address)
                .save(addressToUpdate);
        }

        if (shippingFee) {
            const lineItemToUpdate = orderToUpdate.line_items.find(
                (li) => li.type.name === 'Shipping'
            );
            if (!lineItemToUpdate) {
                console.error(
                    `ORDER|UPDATE - Could not find shipping for order [${orderToUpdate.id}]`
                );
                throw new AppError(
                    `ORDER|UPDATE - Could not find shipping for order [${orderToUpdate.id}]`
                );
            }
            const difference = lineItemToUpdate.price - shippingFee;
            orderToUpdate.total -= difference;
            lineItemToUpdate.price = shippingFee;

            lineItemToUpdate.updated_by =
                event.headers.AuthorizedUserId ??
                event.headers.authorizeduserid;
            await transactionalEntityManager
                .getRepository(LineItem)
                .save(lineItemToUpdate);
        }

        if (!includeGST) {
            const lineItemToUpdate = orderToUpdate.line_items.find(
                (li) => li.type.name === 'Tax'
            );
            if (!lineItemToUpdate) {
                console.error(
                    `ORDER|UPDATE - Could not find Tax for order [${orderToUpdate.id}]`
                );
                throw new AppError(
                    `ORDER|UPDATE - Could not find Tax for order [${orderToUpdate.id}]`
                );
            }
            orderToUpdate.total -= lineItemToUpdate.price;
            lineItemToUpdate.price = 0;

            lineItemToUpdate.updated_by =
                event.headers.AuthorizedUserId ??
                event.headers.authorizeduserid;
            await transactionalEntityManager
                .getRepository(LineItem)
                .save(lineItemToUpdate);
        } else {
            const taxLineItem = orderToUpdate.line_items.find(
                (li) => li.type.name === 'Tax'
            );

            if (!taxLineItem) {
                console.error(
                    `ORDER|UPDATE - Could not find Tax for order [${orderToUpdate.id}]`
                );
                throw new AppError(
                    `ORDER|UPDATE - Could not find Tax for order [${orderToUpdate.id}]`
                );
            }
            if (taxLineItem.price === 0) {
                const taxAmt = getTaxFromLineItems(orderToUpdate.line_items);
                orderToUpdate.total += taxAmt;
                taxLineItem.price = taxAmt;

                taxLineItem.updated_by =
                    event.headers.AuthorizedUserId ??
                    event.headers.authorizeduserid;
                await transactionalEntityManager
                    .getRepository(LineItem)
                    .save(taxLineItem);
            }
        }
        orderToUpdate.updated_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;
        orderToUpdate = await transactionalEntityManager
            .getRepository(Order)
            .save(orderToUpdate);
        console.log('*** FINISH TRANSACTION ***');
    });
    return orderToUpdate;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
