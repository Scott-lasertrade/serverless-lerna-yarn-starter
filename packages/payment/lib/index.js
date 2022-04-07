"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupLineItem = exports.getTaxAmt = exports.getShippingEstimate = exports.getPaymentDetails = exports.getCartItemsAsOrders = exports.getTaxFromLineItems = exports.orderGetPayAmount = exports.orderGetApplicationFee = exports.getSellerAccount = exports.SECURITY_DEPOSIT_AMOUNT = exports.SECURITY_DEPOSIT_THRESHHOLD = void 0;
const data_1 = require("@medii/data");
const transvirtual_1 = require("@medii/transvirtual");
const common_1 = require("@medii/common");
exports.SECURITY_DEPOSIT_THRESHHOLD = 3000;
exports.SECURITY_DEPOSIT_AMOUNT = 1000;
const getSellerAccount = (transactionalEntityManager, listingId, offerId, buyerId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (offerId && buyerId) {
        const offer = yield transactionalEntityManager
            .createQueryBuilder(data_1.Offer, 'o')
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
            .andWhere('os.name = :acceptedStatus OR os.name = :sellerCounteredStatus', {
            acceptedStatus: 'Offer accepted',
            sellerCounteredStatus: 'Seller countered offer',
        })
            .andWhere('ls.name = :listedStatus', {
            listedStatus: 'Listed',
        })
            .getOneOrFail();
        return {
            name: `${offer.listing.YOM} ${((_a = offer.listing.product.manufacturers) === null || _a === void 0 ? void 0 : _a.length) > 0
                ? offer.listing.product.manufacturers
                    .map((m) => m.name)
                    .join(', ')
                : ''} ${offer.listing.product.name}`,
            cost: offer.value,
            sellerId: offer.listing.account.stripe_user_id,
        };
    }
    else {
        const listing = yield transactionalEntityManager
            .createQueryBuilder(data_1.Listing, 'l')
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
            name: `${listing.YOM} ${((_b = listing.product.manufacturers) === null || _b === void 0 ? void 0 : _b.length) > 0
                ? listing.product.manufacturers
                    .map((m) => m.name)
                    .join(', ')
                : ''} ${listing.product.name}`,
            cost: listing.cost,
            sellerId: listing.account.stripe_user_id,
        };
    }
});
exports.getSellerAccount = getSellerAccount;
const orderGetApplicationFee = (order) => {
    if (order.paid >= order.deposit || order.deposit === order.total) {
        if (order.paid >= order.total) {
            console.error(`CREATE TRANSACTION| Order [${order.order_number}] has already been paid for, Paid >= Total: [$ ${order.paid} >= $ ${order.total}]`);
            throw new common_1.AppError(`Order [${order.order_number}] has already been paid for`, 400);
        }
        return (Math.round(((order.total - order.paid) / 100) * order.variable_fee * 100) /
            100 +
            Number(order.fixed_fee));
    }
    return (Math.round(((order.deposit - order.paid) / 100) * order.variable_fee * 100) / 100);
};
exports.orderGetApplicationFee = orderGetApplicationFee;
const orderGetPayAmount = (order) => {
    if (order.paid >= order.deposit) {
        if (order.paid >= order.total) {
            console.error(`CREATE TRANSACTION| Order [${order.order_number}] has already been paid for, Paid >= Total: [$ ${order.paid} >= $ ${order.total}]`);
            throw new common_1.AppError(`Order [${order.order_number}] has already been paid for`, 400);
        }
        return order.total - order.paid;
    }
    return order.deposit - order.paid;
};
exports.orderGetPayAmount = orderGetPayAmount;
const getTaxFromLineItems = (lineItems) => {
    var _a, _b;
    const listingLineItem = lineItems.find((li) => li.type.name === 'Listing');
    const shippingLineItem = lineItems.find((li) => li.type.name === 'Shipping');
    if (!listingLineItem || !shippingLineItem) {
        console.error('getTaxFromLineItems: No listing or shipping associated with order');
    }
    return (Math.round((((_a = listingLineItem === null || listingLineItem === void 0 ? void 0 : listingLineItem.price) !== null && _a !== void 0 ? _a : 0) / 10 +
        ((_b = shippingLineItem === null || shippingLineItem === void 0 ? void 0 : shippingLineItem.price) !== null && _b !== void 0 ? _b : 0) / 10) *
        100) / 100);
};
exports.getTaxFromLineItems = getTaxFromLineItems;
const getCartItemsAsOrders = (transactionalEntityManager, cartItems, userId, authorizedUserId) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e;
    const listingType = (_c = (yield transactionalEntityManager
        .createQueryBuilder(data_1.LineItemType, 'lit')
        .where('lit.name = :type', { type: 'Listing' })
        .getOne())) !== null && _c !== void 0 ? _c : new data_1.LineItemType();
    const shippingType = (_d = (yield transactionalEntityManager
        .createQueryBuilder(data_1.LineItemType, 'lit')
        .where('lit.name = :type', { type: 'Shipping' })
        .getOne())) !== null && _d !== void 0 ? _d : new data_1.LineItemType();
    const taxType = (_e = (yield transactionalEntityManager
        .createQueryBuilder(data_1.LineItemType, 'lit')
        .where('lit.name = :type', { type: 'Tax' })
        .getOne())) !== null && _e !== void 0 ? _e : new data_1.LineItemType();
    let orders = (cartItems === null || cartItems === void 0 ? void 0 : cartItems.length) > 0
        ? yield Promise.all(cartItems.map((cart) => __awaiter(void 0, void 0, void 0, function* () {
            var _f, _g, _h, _j;
            let toReturn = new data_1.Order();
            let listingLineItem = new data_1.LineItem();
            let shippingLineItem = new data_1.LineItem();
            let taxLineItem = new data_1.LineItem();
            let listing = yield transactionalEntityManager
                .createQueryBuilder(data_1.Listing, 'l')
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
                listing = yield transactionalEntityManager
                    .createQueryBuilder(data_1.Listing, 'l')
                    .innerJoinAndSelect('l.listing_status', 'ls')
                    .innerJoinAndSelect('l.product', 'p')
                    .innerJoinAndSelect('p.manufacturers', 'm')
                    .where('l.id = :listingId', {
                    listingId: cart.listing.id,
                })
                    .getOne();
                if (!listing) {
                    throw new common_1.AppError(`Could not find listing information for [${cart.listing.id}]`, 400);
                }
                if (listing.listing_status.name !== 'Pending Sale' &&
                    listing.listing_status.name !== 'Listed') {
                    console.error(`Product ${listing.YOM} ${listing.product.manufacturers
                        .map((m) => m.name)
                        .join(', ')} ${listing.product.name} is not longer in a buyable state, Currently in state [${listing.listing_status.name}]`);
                    throw new common_1.AppError(`Listing[${listing.id}] is not longer in a buyable state`, 400);
                }
                listingLineItem.price = listing.cost;
            }
            else if (((_f = listing.offers) === null || _f === void 0 ? void 0 : _f.length) > 0) {
                listingLineItem.price = listing.offers[0].value;
            }
            else {
                throw new common_1.AppError(`Unexpected error for [${cart.listing.id}]`, 400);
            }
            if (listing.version !== cart.listing_version) {
                throw new common_1.AppError(`Please refresh, as this listing[${listing.id}] has been updated since entering your cart`, 400);
            }
            listingLineItem.title = `${listing.YOM} ${((_g = listing.product.manufacturers) === null || _g === void 0 ? void 0 : _g.length) > 0
                ? listing.product.manufacturers
                    .map((m) => m.name)
                    .join(', ')
                : ''} ${listing.product.name}`;
            listingLineItem.type = listingType;
            listingLineItem.created_by = authorizedUserId;
            listingLineItem.updated_by = authorizedUserId;
            shippingLineItem.title = `Shipping Estimate`;
            shippingLineItem.type = shippingType;
            shippingLineItem.price =
                Math.round((((_h = cart.shipping_estimate) !== null && _h !== void 0 ? _h : 0) -
                    ((_j = cart.shipping_estimate) !== null && _j !== void 0 ? _j : 0) / 11) *
                    100) / 100;
            shippingLineItem.created_by = authorizedUserId;
            shippingLineItem.updated_by = authorizedUserId;
            taxLineItem.title = `GST`;
            taxLineItem.type = taxType;
            taxLineItem.price = (0, exports.getTaxFromLineItems)([
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
                Math.round((Number(listingLineItem.price) +
                    shippingLineItem.price +
                    taxLineItem.price) *
                    100) / 100;
            toReturn.deposit =
                listingLineItem.price > exports.SECURITY_DEPOSIT_THRESHHOLD
                    ? exports.SECURITY_DEPOSIT_AMOUNT
                    : toReturn.total;
            toReturn.paid = 0;
            toReturn.listing = listing;
            toReturn.buyer = yield transactionalEntityManager
                .createQueryBuilder(data_1.Account, 'a')
                .innerJoin('a.users', 'u')
                .where('u.cognito_user_id = :userId', {
                userId: userId,
            })
                .getOneOrFail();
            return toReturn;
        })))
        : [];
    return orders;
});
exports.getCartItemsAsOrders = getCartItemsAsOrders;
const getPaymentDetails = (transactionalEntityManager, listingId, listingVersion, offerId, offerVersion, buyerId) => __awaiter(void 0, void 0, void 0, function* () {
    var _k, _l;
    if (offerId && buyerId) {
        const offer = yield transactionalEntityManager
            .createQueryBuilder(data_1.Offer, 'o')
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
        if (!(offer.account.users
            .map((u) => u.cognito_user_id)
            .indexOf(buyerId) !== -1)) {
            throw new common_1.AppError('Offer does not belong to this user.', 400);
        }
        if (offer.listing.listing_status.name !== 'Listed' &&
            offer.listing.listing_status.name !== 'Pending Sale') {
            throw new common_1.AppError('Listing no longer for sale', 400);
        }
        if (offer.listing.version !== listingVersion ||
            offer.version !== offerVersion) {
            throw new common_1.AppError('Changes have just been made to this listing. Please refresh.', 400);
        }
        if (offer.status.name !== 'Offer accepted' &&
            offer.status.name !== 'Seller countered offer') {
            throw new common_1.AppError('Offer cannot be used to checkout at this time.', 400);
        }
        return {
            name: `${offer.listing.YOM} ${((_k = offer.listing.product.manufacturers) === null || _k === void 0 ? void 0 : _k.length) > 0
                ? offer.listing.product.manufacturers
                    .map((m) => m.name)
                    .join(', ')
                : ''} ${offer.listing.product.name}`,
            offerId: offer.id,
            cost: offer.value,
            seller: offer.listing.account,
        };
    }
    else {
        const listing = yield transactionalEntityManager
            .createQueryBuilder(data_1.Listing, 'l')
            .innerJoinAndSelect('l.product', 'p')
            .leftJoinAndSelect('p.manufacturers', 'm')
            .innerJoinAndSelect('l.listing_status', 'ls')
            .innerJoinAndSelect('l.account', 'seller')
            .where('l.id = :listingId', {
            listingId: listingId,
        })
            .getOneOrFail();
        if (listing.listing_status.name !== 'Listed' &&
            listing.listing_status.name !== 'Pending Sale') {
            throw new common_1.AppError('Listing is currently not for sale', 400);
        }
        if (listing.version !== listingVersion) {
            throw new common_1.AppError('Changes have just been made to this listing. Please refresh.', 400);
        }
        return {
            name: `${listing.YOM} ${((_l = listing.product.manufacturers) === null || _l === void 0 ? void 0 : _l.length) > 0
                ? listing.product.manufacturers
                    .map((m) => m.name)
                    .join(', ')
                : ''} ${listing.product.name}`,
            cost: listing.cost,
            offerId: undefined,
            seller: listing.account,
        };
    }
});
exports.getPaymentDetails = getPaymentDetails;
const getShippingEstimate = (transactionalEntityManager, listingId, address) => __awaiter(void 0, void 0, void 0, function* () {
    if (address.country !== 'AU') {
        return 0;
    }
    const listingDetails = yield transactionalEntityManager
        .createQueryBuilder(data_1.Listing, 'l')
        .innerJoinAndSelect('l.product', 'p')
        .innerJoinAndSelect('p.dimensions', 'd')
        .innerJoinAndSelect('l.address', 'a')
        .where('l.id = :listingId', { listingId: listingId })
        .getOneOrFail();
    const items = [
        new transvirtual_1.ItemDimension(listingDetails.product.dimensions.weight, listingDetails.product.dimensions.length, listingDetails.product.dimensions.width, listingDetails.product.dimensions.height),
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
    const result = yield (0, transvirtual_1.estimatePrice)(listingDetails.address.suburb, listingDetails.address.state, listingDetails.address.post_code, address.suburb, address.state, address.postcode, items);
    console.log('SHIPPING| Estimated', result);
    return result;
});
exports.getShippingEstimate = getShippingEstimate;
const getTaxAmt = (listingCost, shippingCost, country) => {
    if (country !== 'AU') {
        return 0;
    }
    const taxAmount = Number(((shippingCost + Number(listingCost)) / 10).toFixed(2));
    return taxAmount;
};
exports.getTaxAmt = getTaxAmt;
const setupLineItem = (transactionalEntityManager, order, type, newPrice, title) => __awaiter(void 0, void 0, void 0, function* () {
    var _m, _o;
    let lineItem;
    if (((_m = order.line_items) === null || _m === void 0 ? void 0 : _m.length) > 0 &&
        order.line_items.find((itm) => { var _a; return ((_a = itm === null || itm === void 0 ? void 0 : itm.type) === null || _a === void 0 ? void 0 : _a.name) === type; })) {
        lineItem =
            (_o = order.line_items.find((itm) => itm.type.name === type)) !== null && _o !== void 0 ? _o : new data_1.LineItem();
        lineItem.price = newPrice;
    }
    else {
        lineItem = new data_1.LineItem();
        lineItem.title = title;
        lineItem.price = newPrice;
        lineItem.type = yield transactionalEntityManager
            .createQueryBuilder(data_1.LineItemType, 'lit')
            .where('lit.name = :typeName', {
            typeName: type,
        })
            .getOneOrFail();
    }
    return lineItem;
});
exports.setupLineItem = setupLineItem;
//# sourceMappingURL=index.js.map