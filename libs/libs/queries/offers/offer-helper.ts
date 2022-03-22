import { Offer } from '@entities';
import { AppError } from '@libs/appError';

export const getOffer = async ({
    dbConn,
    offerId,
    userId = '',
    isAdmin = false,
}) => {
    const offer = await dbConn
        .createQueryBuilder(Offer, 'o')
        .innerJoinAndSelect('o.status', 'os')
        .innerJoinAndSelect('o.account', 'buyerAccount')
        .leftJoinAndSelect('buyerAccount.users', 'buyer')
        .innerJoinAndSelect('o.listing', 'l')
        .innerJoinAndSelect('l.product', 'p')
        .innerJoinAndSelect('l.account', 'acc')
        .leftJoinAndSelect('acc.users', 'seller')
        .leftJoinAndSelect('o.offer_history', 'oh')
        .leftJoinAndSelect('oh.status', 'ohs')
        .where(
            '(buyer.cognito_user_id = :userId OR seller.cognito_user_id = :userId OR true = :isAdmin)',
            {
                userId: userId,
                isAdmin: isAdmin,
            }
        )
        .andWhere('o.id = :id', {
            id: offerId,
        })
        .getOne();

    if (!offer) {
        throw new AppError('You are not apart of this offer.', 400);
    }
    return offer;
};
