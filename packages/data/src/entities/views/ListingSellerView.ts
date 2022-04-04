import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
    name: 'listing_seller_view',
    expression: `
        select  l.id as listing_id, 
                ls."name" as listing_status, 
                p.id as product_id, 
                coalesce(cast(l."YOM" as text), '') || ' ' || cast(coalesce((string_agg(m.name, ' ')), '') as text) || ' ' || p.name as product_name, 
                lister.cognito_user_id as lister_id 
        from listing l
        left join listing_status ls on ls.id = l."listingStatusId" 
        left join product p on l."productId" = p.id
        left join product_to_manufacturer ptm on ptm.product = p.id
        left join manufacturer m on m.id = ptm.manufacturer 
        left join account LA on l."accountId" = LA.id
        left join account_to_user LTU on LTU.account = LA.id
        left join public.user lister on LTU.user = lister.id
        group by l.id, ls.name, p.id, l."YOM", p.name, lister.cognito_user_id
    `,
})
export class ListingSellerView {
    @ViewColumn()
    listing_id: number;

    @ViewColumn()
    listing_status: string;

    @ViewColumn()
    product_id: number;

    @ViewColumn()
    product_name: string;

    @ViewColumn()
    lister_id: string;
}
