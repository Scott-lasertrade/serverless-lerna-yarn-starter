import { EntityManager } from 'typeorm';
import { Account, CartItem, LineItem, Order } from '@medii/data';
export declare const SECURITY_DEPOSIT_THRESHHOLD = 3000;
export declare const SECURITY_DEPOSIT_AMOUNT = 1000;
export declare const getSellerAccount: (transactionalEntityManager: EntityManager, listingId: number, offerId: number, buyerId: string) => Promise<{
    name: string;
    cost: number;
    sellerId: string;
}>;
export declare const orderGetApplicationFee: (order: Order) => number;
export declare const orderGetPayAmount: (order: Order) => number;
export declare const getTaxFromLineItems: (lineItems: LineItem[]) => number;
export declare const getCartItemsAsOrders: (transactionalEntityManager: EntityManager, cartItems: CartItem[], userId: string, authorizedUserId: string) => Promise<Order[]>;
export declare const getPaymentDetails: (transactionalEntityManager: EntityManager, listingId: number, listingVersion: number, offerId: number, offerVersion: number, buyerId: string) => Promise<{
    name: string;
    offerId: number | undefined;
    cost: number;
    seller: Account;
}>;
export declare const getShippingEstimate: (transactionalEntityManager: EntityManager, listingId: number, address: any) => Promise<any>;
export declare const getTaxAmt: (listingCost: number, shippingCost: number, country: string) => number;
export declare const setupLineItem: (transactionalEntityManager: EntityManager, order: Order, type: string, newPrice: number, title: string) => Promise<LineItem>;
//# sourceMappingURL=index.d.ts.map