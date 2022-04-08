import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import {
    Database,
    Address,
    AddressType,
    CartItem,
    Checkout,
    Country,
    LineItem,
    Order,
    OrderBuyerDetails,
    OrderStatus,
} from '@medii/data';
import { getCartItemsAsOrders } from '@medii/payment';
import schema from './schema';

const database = new Database();

const setupOrAppendLineItem = (
    order: Order,
    newLineItems: LineItem[],
    type: string
) => {
    if (order.line_items.findIndex((li) => li.type?.name === type)) {
        order.line_items[
            order.line_items.findIndex((li) => li.type?.name === type)
        ] = newLineItems.find((li) => li.type?.name === type) ?? new LineItem();
    } else {
        order.line_items = [
            ...order.line_items,
            newLineItems.find((li) => li.type.name === type) ?? new LineItem(),
        ];
    }
    return order.line_items;
};

const task = async (event) => {
    const userId = event.headers.CurrentUserId ?? event.headers.currentuserid;
    const address = event.body.address;
    const buyerDetails = event.body.buyerDetails;
    const checkoutId = event.body.id;

    const dbConn = await database.getConnection();
    let cartItems: CartItem[];
    let checkout: Checkout = new Checkout();

    await dbConn.transaction(async (transactionalEntityManager) => {
        if (checkoutId) {
            console.log('CART SUBMIT| Finding existing Checkout...');
            checkout =
                (await transactionalEntityManager
                    .createQueryBuilder(Checkout, 'checkout')
                    .innerJoinAndSelect('checkout.orders', 'order')
                    .innerJoinAndSelect('order.listing', 'l')
                    .leftJoinAndSelect(
                        'checkout.buyer_details',
                        'buyer_details'
                    )
                    .innerJoinAndSelect('order.buyer', 'bacc')
                    .leftJoinAndSelect('bacc.users', 'u')
                    .leftJoinAndSelect('buyer_details.address', 'badd')
                    .leftJoinAndSelect('order.status', 'os')
                    .leftJoinAndSelect('order.line_items', 'itm')
                    .leftJoinAndSelect('itm.type', 'it')
                    .where('checkout.id = :checkoutId', {
                        checkoutId: checkoutId,
                    })
                    .andWhere('u.cognito_user_id = :userId', {
                        userId: userId,
                    })
                    .getOne()) ?? new Checkout();
            console.log('CART SUBMIT| Found existing Checkout...', checkout);
        }

        if (!checkout) {
            checkout = new Checkout();
        }
        cartItems = await transactionalEntityManager
            .createQueryBuilder(CartItem, 'cart')
            .innerJoinAndSelect('cart.listing', 'l')
            .innerJoinAndSelect('cart.account', 'acc')
            .innerJoinAndSelect('acc.users', 'u')
            .where('u.cognito_user_id = :userId', { userId: userId })
            .getMany();

        const orders = await getCartItemsAsOrders(
            transactionalEntityManager,
            cartItems,
            userId,
            event.headers.authorizeduserid
        );

        if (orders?.length > 0) {
            checkout.orders = await Promise.all(
                orders.map(async (order) => {
                    let orderToReturn: Order;
                    if (checkout?.orders?.length > 0) {
                        orderToReturn =
                            checkout.orders.find(
                                (ord) => ord.listing.id === order.listing.id
                            ) ?? new Order();
                        if (!orderToReturn) {
                            orderToReturn = order;
                        } else {
                            // S.Y. Update existing order values.
                            orderToReturn.total = order.total;
                            orderToReturn.deposit = order.deposit;
                            orderToReturn.paid = orderToReturn.paid ?? 0;
                            console.log(
                                'CART SUBMIT| Setting up line items...'
                            );
                            if (orderToReturn.line_items?.length > 0) {
                                orderToReturn.line_items =
                                    setupOrAppendLineItem(
                                        orderToReturn,
                                        order.line_items,
                                        'Shipping'
                                    );
                                orderToReturn.line_items =
                                    setupOrAppendLineItem(
                                        orderToReturn,
                                        order.line_items,
                                        'Tax'
                                    );
                                orderToReturn.line_items =
                                    setupOrAppendLineItem(
                                        orderToReturn,
                                        order.line_items,
                                        'Listing'
                                    );
                            } else {
                                orderToReturn.line_items = order.line_items;
                            }
                        }
                    } else {
                        orderToReturn = order;
                    }

                    orderToReturn.line_items = await transactionalEntityManager
                        .getRepository(LineItem)
                        .save(orderToReturn.line_items);
                    console.log(
                        'CART SUBMIT| Saved line items',
                        orderToReturn.line_items
                    );
                    orderToReturn.status = await transactionalEntityManager
                        .createQueryBuilder(OrderStatus, 'os')
                        .where('os.name = :draftStatus', {
                            draftStatus: 'Details Provided',
                        })
                        .getOneOrFail();
                    orderToReturn.created_by =
                        event.headers.AuthorizedUserId ??
                        event.headers.authorizeduserid;
                    orderToReturn.updated_by =
                        event.headers.AuthorizedUserId ??
                        event.headers.authorizeduserid;

                    orderToReturn = await transactionalEntityManager
                        .getRepository(Order)
                        .save(orderToReturn);
                    console.log('CART SUBMIT| Saved order', orderToReturn);
                    return orderToReturn;
                })
            );
        }

        let buyer_details: OrderBuyerDetails;
        let buyer_address: Address;
        if (checkout.buyer_details) {
            buyer_details = checkout.buyer_details;
        } else {
            buyer_details = new OrderBuyerDetails();
        }
        if (!buyer_details.address) {
            buyer_address = new Address();
            buyer_address.address_type = await transactionalEntityManager
                .createQueryBuilder(AddressType, 'at')
                .where('at.name = :addressType', {
                    addressType: 'Shipping',
                })
                .getOneOrFail();
        } else {
            buyer_address = buyer_details.address;
        }
        buyer_address.address_line_1 = address.line1;
        buyer_address.address_line_2 = address.line2;
        buyer_address.suburb = address.suburb;
        buyer_address.state = address.state;
        buyer_address.post_code = address.postcode;
        buyer_address.country = await transactionalEntityManager
            .createQueryBuilder(Country, 'c')
            .where('c.abbreviation = :country', {
                country: address.country,
            })
            .getOneOrFail();

        buyer_address.created_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;
        buyer_address.updated_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;

        buyer_address = await transactionalEntityManager
            .getRepository(Address)
            .save(buyer_address);
        console.log('CART SUBMIT| Saved buyer address', buyer_address);

        buyer_details.address = buyer_address;
        buyer_details.first_name = buyerDetails.fName;
        buyer_details.last_name = buyerDetails.lName;
        buyer_details.email = buyerDetails.email;
        buyer_details.phone = buyerDetails.phone;
        buyer_details.business_name = buyerDetails.bName;
        buyer_details.tax_id = buyerDetails.taxId;
        buyer_details.created_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;
        buyer_details.updated_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;

        buyer_details = await transactionalEntityManager
            .getRepository(OrderBuyerDetails)
            .save(buyer_details);
        console.log('CART SUBMIT| Saved buyer details', buyer_address);

        checkout.buyer_details = buyer_details;

        await transactionalEntityManager.getRepository(Checkout).save(checkout);
        console.log('CART SUBMIT| Saved checkout', checkout);
    });
    return checkout;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
