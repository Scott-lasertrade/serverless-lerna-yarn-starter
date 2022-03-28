import { EntityManager } from 'typeorm';
import {
    Account,
    CartItem,
    LineItem,
    LineItemType,
    Listing,
    Offer,
    Order,
} from '@entities';
import {
    estimatePrice,
    ItemDimension,
} from '../../packages/transvirtual-package';
import { AppError } from './appError';

export const SECURITY_DEPOSIT_THRESHHOLD = 3000;
export const SECURITY_DEPOSIT_AMOUNT = 1000;

export const getSellerAccount = async (
    transactionalEntityManager: EntityManager,
    listingId: number,
    offerId: number,
    buyerId: string
) => {
    if (offerId && buyerId) {
        // TODO Account for Seller countered.
        const offer = await transactionalEntityManager
            .createQueryBuilder(Offer, 'o')
            .innerJoinAndSelect('o.status', 'os')
            .innerJoinAndSelect('o.listing', 'l')
            .innerJoinAndSelect('l.product', 'p')
            .leftJoinAndSelect('p.manufacturers', 'm')
            .innerJoinAndSelect('l.listing_status', 'ls')
            .innerJoinAndSelect('l.account', 'seller')
            .innerJoinAndSelect('o.account', 'BA')
            .innerJoinAndSelect('BA.users', 'buyer')
            .where('o.id = :offerId', { offerId: offerId })
            .andWhere('l.id = :listingId', { listingId: listingId })
            .andWhere('buyer.cognito_user_id = :cogId', {
                cogId: buyerId,
            })
            .andWhere(
                'os.name = :acceptedStatus OR os.name = :sellerCounteredStatus',
                {
                    acceptedStatus: 'Offer accepted',
                    sellerCounteredStatus: 'Seller countered offer',
                }
            )
            .andWhere('ls.name = :listedStatus', {
                listedStatus: 'Listed',
            })
            .getOneOrFail();
        return {
            name: `${offer.listing.YOM} ${
                offer.listing.product.manufacturers?.length > 0
                    ? offer.listing.product.manufacturers
                          .map((m) => m.name)
                          .join(', ')
                    : ''
            } ${offer.listing.product.name}`,
            cost: offer.value,
            sellerId: offer.listing.account.stripe_user_id,
        };
    } else {
        // TODO Account for Seller countered.
        const listing = await transactionalEntityManager
            .createQueryBuilder(Listing, 'l')
            .innerJoinAndSelect('l.product', 'p')
            .leftJoinAndSelect('p.manufacturers', 'm')
            .innerJoinAndSelect('l.listing_status', 'ls')
            .innerJoinAndSelect('l.account', 'seller')
            .where('l.id = :listingId', { listingId: listingId })
            .andWhere('ls.name = :listedStatus', {
                listedStatus: 'Listed',
            })
            .getOneOrFail();
        return {
            name: `${listing.YOM} ${
                listing.product.manufacturers?.length > 0
                    ? listing.product.manufacturers
                          .map((m) => m.name)
                          .join(', ')
                    : ''
            } ${listing.product.name}`,
            cost: listing.cost,
            sellerId: listing.account.stripe_user_id,
        };
    }
};

export const orderGetApplicationFee = (order: Order) => {
    if (order.paid >= order.deposit || order.deposit === order.total) {
        if (order.paid >= order.total) {
            console.error(
                `CREATE TRANSACTION| Order [${order.order_number}] has already been paid for, Paid >= Total: [$ ${order.paid} >= $ ${order.total}]`
            );
            throw new AppError(
                `Order [${order.order_number}] has already been paid for`,
                400
            );
        }
        // BALANCE - REMOVE VARIABLE FEE & FIXED FEE
        return (
            Math.round(
                ((order.total - order.paid) / 100) * order.variable_fee * 100
            ) /
                100 +
            Number(order.fixed_fee)
        );
    }
    // DEPOSIT - ONLY REMOVE VARIABLE FEE
    return (
        Math.round(
            ((order.deposit - order.paid) / 100) * order.variable_fee * 100
        ) / 100
    );
};

export const orderGetPayAmount = (order: Order) => {
    if (order.paid >= order.deposit) {
        if (order.paid >= order.total) {
            console.error(
                `CREATE TRANSACTION| Order [${order.order_number}] has already been paid for, Paid >= Total: [$ ${order.paid} >= $ ${order.total}]`
            );
            throw new AppError(
                `Order [${order.order_number}] has already been paid for`,
                400
            );
        }
        return order.total - order.paid;
    }
    return order.deposit - order.paid;
};

export const getTaxFromLineItems = (lineItems: LineItem[]) => {
    const listingLineItem = lineItems.find((li) => li.type.name === 'Listing');
    const shippingLineItem = lineItems.find(
        (li) => li.type.name === 'Shipping'
    );
    if (!listingLineItem || !shippingLineItem) {
        console.error(
            'getTaxFromLineItems: No listing or shipping associated with order'
        );
    }
    return (
        Math.round(
            ((listingLineItem?.price ?? 0) / 10 +
                (shippingLineItem?.price ?? 0) / 10) *
                100
        ) / 100
    );
};

export const getCartItemsAsOrders = async (
    transactionalEntityManager: EntityManager,
    cartItems: CartItem[],
    userId: string,
    authorizedUserId: string
) => {
    let listingType = await transactionalEntityManager
        .createQueryBuilder(LineItemType, 'lit')
        .where('lit.name = :type', { type: 'Listing' })
        .getOne();
    let shippingType = await transactionalEntityManager
        .createQueryBuilder(LineItemType, 'lit')
        .where('lit.name = :type', { type: 'Shipping' })
        .getOne();
    let taxType = await transactionalEntityManager
        .createQueryBuilder(LineItemType, 'lit')
        .where('lit.name = :type', { type: 'Tax' })
        .getOne();

    let orders =
        cartItems?.length > 0
            ? await Promise.all(
                  cartItems.map(async (cart: CartItem) => {
                      let toReturn: Order = new Order();

                      let listingLineItem = new LineItem();
                      let shippingLineItem = new LineItem();
                      let taxLineItem = new LineItem();

                      let listing = await transactionalEntityManager
                          .createQueryBuilder(Listing, 'l')
                          .innerJoinAndSelect('l.listing_status', 'ls')
                          .innerJoinAndSelect('l.product', 'p')
                          .innerJoinAndSelect('p.manufacturers', 'm')
                          .innerJoinAndSelect('l.offers', 'offer')
                          .innerJoinAndSelect('offer.status', 'os')
                          .innerJoinAndSelect('offer.account', 'bacc')
                          .innerJoinAndSelect('bacc.users', 'u')
                          .where('l.id = :listingId', {
                              listingId: cart.listing.id,
                          })
                          .andWhere('u.cognito_user_id = :buyerId', {
                              buyerId: userId,
                          })
                          .andWhere('os.name = :acceptedStatus', {
                              acceptedStatus: 'Offer accepted',
                          })
                          .getOne();

                      if (!listing) {
                          listing = await transactionalEntityManager
                              .createQueryBuilder(Listing, 'l')
                              .innerJoinAndSelect('l.listing_status', 'ls')
                              .innerJoinAndSelect('l.product', 'p')
                              .innerJoinAndSelect('p.manufacturers', 'm')
                              .where('l.id = :listingId', {
                                  listingId: cart.listing.id,
                              })
                              .getOne();

                          if (!listing) {
                              throw new AppError(
                                  `Could not find listing information for [${cart.listing.id}]`,
                                  400
                              );
                          }
                          if (
                              listing.listing_status.name !== 'Pending Sale' &&
                              listing.listing_status.name !== 'Listed'
                          ) {
                              console.error(
                                  `Product ${
                                      listing.YOM
                                  } ${listing.product.manufacturers
                                      .map((m) => m.name)
                                      .join(', ')} ${
                                      listing.product.name
                                  } is not longer in a buyable state, Currently in state [${
                                      listing.listing_status.name
                                  }]`
                              );
                              throw new AppError(
                                  `Listing[${listing.id}] is not longer in a buyable state`,
                                  400
                              );
                          }
                          listingLineItem.price = listing.cost;
                      } else if (listing.offers?.length > 0) {
                          listingLineItem.price = listing.offers[0].value;
                      } else {
                          throw new AppError(
                              `Unexpected error for [${cart.listing.id}]`,
                              400
                          );
                      }
                      if (listing.version !== cart.listing_version) {
                          throw new AppError(
                              `Please refresh, as this listing[${listing.id}] has been updated since entering your cart`,
                              400
                          );
                      }

                      listingLineItem.title = `${listing.YOM} ${
                          listing.product.manufacturers?.length > 0
                              ? listing.product.manufacturers
                                    .map((m) => m.name)
                                    .join(', ')
                              : ''
                      } ${listing.product.name}`;
                      listingLineItem.type = listingType;
                      listingLineItem.created_by = authorizedUserId;
                      listingLineItem.updated_by = authorizedUserId;

                      shippingLineItem.title = `Shipping Estimate`;
                      shippingLineItem.type = shippingType;
                      shippingLineItem.price =
                          Math.round(
                              ((cart.shipping_estimate ?? 0) -
                                  (cart.shipping_estimate ?? 0) / 11) *
                                  100
                          ) / 100;
                      shippingLineItem.created_by = authorizedUserId;
                      shippingLineItem.updated_by = authorizedUserId;

                      taxLineItem.title = `GST`;
                      taxLineItem.type = taxType;
                      taxLineItem.price = getTaxFromLineItems([
                          listingLineItem,
                          shippingLineItem,
                      ]);
                      taxLineItem.created_by = authorizedUserId;
                      taxLineItem.updated_by = authorizedUserId;

                      toReturn.line_items = [
                          listingLineItem,
                          shippingLineItem,
                          taxLineItem,
                      ];
                      toReturn.total =
                          Math.round(
                              (Number(listingLineItem.price) +
                                  shippingLineItem.price +
                                  taxLineItem.price) *
                                  100
                          ) / 100;
                      toReturn.deposit =
                          listingLineItem.price > SECURITY_DEPOSIT_THRESHHOLD
                              ? SECURITY_DEPOSIT_AMOUNT
                              : toReturn.total;
                      toReturn.paid = 0;
                      toReturn.listing = listing;
                      toReturn.buyer = await transactionalEntityManager
                          .createQueryBuilder(Account, 'a')
                          .innerJoin('a.users', 'u')
                          .where('u.cognito_user_id = :userId', {
                              userId: userId,
                          })
                          .getOneOrFail();
                      return toReturn;
                  })
              )
            : [];
    return orders;
};

export const getPaymentDetails = async (
    transactionalEntityManager: EntityManager,
    listingId: number,
    listingVersion: number,
    offerId: number,
    offerVersion: number,
    buyerId: string
) => {
    if (offerId && buyerId) {
        // TODO Account for Seller countered.
        const offer = await transactionalEntityManager
            .createQueryBuilder(Offer, 'o')
            .innerJoinAndSelect('o.status', 'os')
            .innerJoinAndSelect('o.listing', 'l')
            .innerJoinAndSelect('l.product', 'p')
            .leftJoinAndSelect('p.manufacturers', 'm')
            .innerJoinAndSelect('l.listing_status', 'ls')
            .innerJoinAndSelect('l.account', 'seller')
            .innerJoinAndSelect('o.account', 'BA')
            .innerJoinAndSelect('BA.users', 'buyer')
            .where('o.id = :offerId', {
                offerId: offerId,
            })
            .andWhere('l.id = :listingId', {
                listingId: listingId,
            })
            .getOneOrFail();

        if (
            !offer.account.users.map((u) => u.cognito_user_id).includes(buyerId)
        ) {
            throw new AppError('Offer does not belong to this user.', 400);
        }
        if (
            offer.listing.listing_status.name !== 'Listed' &&
            offer.listing.listing_status.name !== 'Pending Sale'
        ) {
            throw new AppError('Listing no longer for sale', 400);
        }
        if (
            offer.listing.version !== listingVersion ||
            offer.version !== offerVersion
        ) {
            throw new AppError(
                'Changes have just been made to this listing. Please refresh.',
                400
            );
        }
        if (
            offer.status.name !== 'Offer accepted' &&
            offer.status.name !== 'Seller countered offer'
        ) {
            throw new AppError(
                'Offer cannot be used to checkout at this time.',
                400
            );
        }
        return {
            name: `${offer.listing.YOM} ${
                offer.listing.product.manufacturers?.length > 0
                    ? offer.listing.product.manufacturers
                          .map((m) => m.name)
                          .join(', ')
                    : ''
            } ${offer.listing.product.name}`,
            offerId: offer.id,
            cost: offer.value,
            seller: offer.listing.account,
        };
    } else {
        // TODO Account for Seller countered.
        const listing = await transactionalEntityManager
            .createQueryBuilder(Listing, 'l')
            .innerJoinAndSelect('l.product', 'p')
            .leftJoinAndSelect('p.manufacturers', 'm')
            .innerJoinAndSelect('l.listing_status', 'ls')
            .innerJoinAndSelect('l.account', 'seller')
            .where('l.id = :listingId', {
                listingId: listingId,
            })
            .getOneOrFail();

        if (
            listing.listing_status.name !== 'Listed' &&
            listing.listing_status.name !== 'Pending Sale'
        ) {
            throw new AppError('Listing is currently not for sale', 400);
        }
        if (listing.version !== listingVersion) {
            throw new AppError(
                'Changes have just been made to this listing. Please refresh.',
                400
            );
        }
        return {
            name: `${listing.YOM} ${
                listing.product.manufacturers?.length > 0
                    ? listing.product.manufacturers
                          .map((m) => m.name)
                          .join(', ')
                    : ''
            } ${listing.product.name}`,
            cost: listing.cost,
            offerId: undefined,
            seller: listing.account,
        };
    }
};

export const getShippingEstimate = async (
    transactionalEntityManager: EntityManager,
    listingId: number,
    address: any
) => {
    if (address.country !== 'AU') {
        return 0;
    }

    const listingDetails = await transactionalEntityManager
        .createQueryBuilder(Listing, 'l')
        .innerJoinAndSelect('l.product', 'p')
        .innerJoinAndSelect('p.dimensions', 'd')
        .innerJoinAndSelect('l.address', 'a')
        .where('l.id = :listingId', { listingId: listingId })
        .getOneOrFail();

    const items: ItemDimension[] = [
        new ItemDimension(
            listingDetails.product.dimensions.weight,
            listingDetails.product.dimensions.length,
            listingDetails.product.dimensions.width,
            listingDetails.product.dimensions.height
        ),
    ];

    console.log('SHIPPING| Estimating...', {
        sellerSuburb: listingDetails.address.suburb,
        sellerState: listingDetails.address.state,
        sellerPostcode: listingDetails.address.post_code,
        buyerSuburb: address.suburb,
        buyerState: address.state,
        buyerPostcode: address.postcode,
        itemDimensions: items,
    });
    const result = await estimatePrice(
        listingDetails.address.suburb,
        listingDetails.address.state,
        listingDetails.address.post_code,
        address.suburb,
        address.state,
        address.postcode,
        items
    );
    console.log('SHIPPING| Estimated', result);
    return result;
};

export const getTaxAmt = (
    listingCost: number,
    shippingCost: number,
    country: string
) => {
    if (country !== 'AU') {
        return 0;
    }

    const taxAmount = Number(
        ((shippingCost + Number(listingCost)) / 10).toFixed(2)
    );
    return taxAmount;
};

export const setupLineItem = async (
    transactionalEntityManager: EntityManager,
    order: Order,
    type: string,
    newPrice: number,
    title: string
) => {
    let lineItem: LineItem;
    if (
        order.line_items?.length > 0 &&
        order.line_items.find((itm) => itm?.type?.name === type)
    ) {
        lineItem = order.line_items.find((itm) => itm.type.name === type);
        lineItem.price = newPrice;
    } else {
        lineItem = new LineItem();
        lineItem.title = title;
        lineItem.price = newPrice;
        lineItem.type = await transactionalEntityManager
            .createQueryBuilder(LineItemType, 'lit')
            .where('lit.name = :typeName', {
                typeName: type,
            })
            .getOneOrFail();
    }
    return lineItem;
};
