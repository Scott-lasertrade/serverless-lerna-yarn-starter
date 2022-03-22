import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
    name: 'offer_relation_view',
    expression: `
        select  o.id as offer_id, 
                os.name as offer_status, 
                l.id as listing_id, 
                ls.name as listing_status, 
                p.id as product_id, 
                coalesce(cast(l."YOM" as text), '') || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as product_name, 
                buyer.cognito_user_id as buyer_id, 
                seller.cognito_user_id as seller_id 
        from offer o
        left join offer_status os on o."statusId" = os.id 
        left join account BA on o."accountId" = BA.id
        left join account_to_user BTU on BTU.account = BA.id
        left join public.user buyer on BTU.user = buyer.id
        left join listing l on o."listingId" = l.id
        left join listing_status ls on ls.id = l."listingStatusId" 
        left join product p on l."productId" = p.id
        left join product_to_manufacturer ptm on ptm.product = p.id
        left join manufacturer m on m.id = ptm.manufacturer 
        left join account SA on l."accountId" = SA.id
        left join account_to_user STU on STU.account = SA.id
        left join public.user seller on STU.user = seller.id
        group by o.id, os.name, l.id, ls.name, p.id, l."YOM", p.name, buyer.cognito_user_id, seller.cognito_user_id
    `,
})
export class OfferRelationView {
    @ViewColumn()
    offer_id: number;

    @ViewColumn()
    offer_status: string;

    @ViewColumn()
    listing_id: number;

    @ViewColumn()
    listing_status: string;

    @ViewColumn()
    product_id: number;

    @ViewColumn()
    product_name: string;

    @ViewColumn()
    buyer_id: string;

    @ViewColumn()
    seller_id: string;
}
