import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, CartItem, Order } from '@medii/data';
import { AppError } from '@medii/common';
import { getShippingEstimate, getCartItemsAsOrders } from '@medii/payment';
import { EntityNotFoundError } from 'typeorm';
import schema from './schema';

const database = new Database();

const task = async (event) => {
    const address = event.body.address;
    const userId = event.headers.CurrentUserId ?? event.headers.currentuserid;

    const dbConn = await database.getConnection();
    let cartItems: CartItem[];
    let toReturn: Order[] = [];

    await dbConn.transaction(async (transactionalEntityManager) => {
        console.log('Find cartItems', userId);
        cartItems = await transactionalEntityManager
            .createQueryBuilder(CartItem, 'cart')
            .innerJoinAndSelect('cart.listing', 'l')
            .innerJoinAndSelect('l.listing_status', 'ls')
            .innerJoinAndSelect('cart.account', 'acc')
            .innerJoinAndSelect('acc.users', 'u')
            .where('u.cognito_user_id = :userId', { userId: userId })
            .getMany();

        cartItems =
            cartItems?.length > 0
                ? await Promise.all(
                      cartItems.map(async (cart: CartItem) => {
                          if (cart.listing.listing_status.name !== 'Listed') {
                              throw new AppError(
                                  'Changes have been made to this listing. Please refresh.',
                                  400
                              );
                          }
                          let shippingCost = 0.0;
                          if (
                              address.postcode &&
                              address.state &&
                              address.suburb &&
                              address.country
                          ) {
                              try {
                                  shippingCost = await getShippingEstimate(
                                      transactionalEntityManager,
                                      cart?.listing?.id ?? 0,
                                      address
                                  );
                              } catch (err) {
                                  console.log(err);
                                  if (err instanceof EntityNotFoundError) {
                                      throw new AppError(err.message, 400);
                                  } else if (err instanceof AppError) {
                                      if (err.message.includes('timeout')) {
                                          throw new AppError(err.message, 400);
                                      }
                                  } else {
                                      shippingCost = 0;
                                  }
                              }
                          } else {
                              shippingCost = 0;
                          }
                          cart.shipping_estimate = shippingCost;
                          cart.listing_version = cart?.listing?.version ?? 0;
                          cart.updated_by =
                              event.headers.AuthorizedUserId ??
                              event.headers.authorizeduserid;

                          return await transactionalEntityManager
                              .getRepository(CartItem)
                              .save(cart);
                      })
                  )
                : [];

        toReturn = await getCartItemsAsOrders(
            transactionalEntityManager,
            cartItems,
            userId,
            event.headers.authorizeduserid
        );
    });
    return toReturn;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
