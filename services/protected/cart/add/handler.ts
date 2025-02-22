import 'source-map-support/register';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Listing, CartItem, Account } from '@medii/data';
import { AppError } from '@medii/common';
import schema from './schema';

const database = new Database();

const task = async (event) => {
    const dbConn = await database.getConnection();
    const userId = event.headers.CurrentUserId ?? event.headers.currentuserid;

    if (!Number(event.pathParameters.listingId)) {
        throw new AppError(
            `Incorrect ids format provided - ${event.pathParameters.id}`,
            400
        );
    }
    const listingId = Number(event.pathParameters.listingId);

    let cart: CartItem = new CartItem();
    await dbConn.transaction(async (transactionalEntityManager) => {
        console.log('ADD CART| find existing...');
        const existingCartItem = await transactionalEntityManager
            .createQueryBuilder(CartItem, 'cart')
            .innerJoin('cart.listing', 'l')
            .innerJoin('cart.account', 'acc')
            .innerJoin('acc.users', 'u')
            .where('u.cognito_user_id = :userId', {
                userId: userId,
            })
            .andWhere('l.id = :listingId', { listingId: listingId })
            .getOne();
        console.log('ADD CART| existing items...', existingCartItem);

        const curAccount = await transactionalEntityManager
            .createQueryBuilder(Account, 'acc')
            .innerJoin('acc.users', 'u')
            .where('u.cognito_user_id = :userId', {
                userId: userId,
            })
            .getOneOrFail();

        const listing = await transactionalEntityManager
            .createQueryBuilder(Listing, 'list')
            .innerJoinAndSelect('list.listing_status', 'ls')
            .innerJoinAndSelect('list.product', 'p')
            .leftJoinAndSelect('p.dimensions', 'pd')
            .where('list.id = :listingId', {
                listingId: listingId,
            })
            .getOneOrFail();

        // S.Y - Validation to add listing to cart
        if (listing.listing_status.name !== 'Listed') {
            console.error(
                `VALIDATION| Listing at invalid status, expected [Listed] got [${listing.listing_status.name}]`
            );
            throw new AppError(
                'Listing cannot be added to cart due to invalid status',
                400
            );
        }
        if (!listing.product.is_active || listing.product.is_draft) {
            console.error(
                `VALIDATION| Product at invalid status, is_active [${listing.product.is_active}] is_draft [${listing.product.is_draft}]`
            );
            throw new AppError(
                'Listing cannot be added to cart due to Product invalid status',
                400
            );
        }
        if (!(listing.product.dimensions?.weight > 0.0)) {
            console.error(
                `VALIDATION| Invalid product dimensions, Dimensinos [${listing.product.dimensions?.weight}, ${listing.product.dimensions?.width}, ${listing.product.dimensions?.height}, ${listing.product.dimensions?.length}]`
            );
            throw new AppError(
                'Listing cannot be added to cart due to Product invalid Dimensions',
                400
            );
        }

        cart.listing = listing;
        if (existingCartItem) {
            cart = existingCartItem;
        } else {
            cart.account = curAccount;
            cart.created_by =
                event.headers.AuthorizedUserId ??
                event.headers.authorizeduserid;
        }
        cart.listing_version = listing?.version ?? 0;

        cart.updated_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;
        cart = await transactionalEntityManager
            .getRepository(CartItem)
            .save(cart);
        console.log('ADD CART| added...', cart);
    });
    return cart;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main: any = middyfy(handler);
