import { ViewEntity, ViewColumn } from 'typeorm';
@ViewEntity({
    name: 'listings_approval_view',
    expression: `
        select 	l.id, 
                l.version as version,
                l.cost as cost,
                a.id as account_id,
                p.id as product_id,
                p.name as product_name,
                p.is_active as product_is_active,
                p.is_draft as product_is_draft,
                p.version as product_version,
                coalesce(cast(l."YOM" as text), '') || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as title,
                coalesce(string_agg(cast(m.id as text), ',')) as manufacturers,
                li.key as thumbnail_key,
                li.bucket as thumbnail_bucket,
                li.region as thumbnail_region,
                ls.name as listing_status,
                a.business_name as submitted_by, 
                l.create_at
        from public.listing l
        inner join product p on l."productId" = p.id 
        inner join listing_status ls on ls.id = l."listingStatusId"
        inner join account a on l."accountId" = a.id 
        left join listing_image li on li."listingId" = l.id and li.order = 0
        left join product_to_manufacturer ptm on ptm.product = p.id
        left join manufacturer m on ptm.manufacturer = m.id
        where p.deleted_date is null and l.deleted_date is null and li.deleted_date is null
        group by l.id, p.id, li.id, a.id, ls.id
    `,
})
export class ListingApprovalsView {
    @ViewColumn()
    id: number;

    @ViewColumn()
    account_id: number;

    @ViewColumn()
    product_id: string;

    @ViewColumn()
    product_name: string;

    @ViewColumn()
    cost: number;

    @ViewColumn()
    product_is_active: boolean;

    @ViewColumn()
    product_is_draft: boolean;

    @ViewColumn()
    product_version: number;

    @ViewColumn()
    version: number;

    @ViewColumn()
    listing_status: string;

    @ViewColumn()
    title: string;

    @ViewColumn()
    thumbnail_key: string;

    @ViewColumn()
    thumbnail_bucket: string;

    @ViewColumn()
    thumbnail_region: string;

    @ViewColumn()
    submitted_by: string;

    @ViewColumn()
    create_at: Date;
    @ViewColumn()
    manufacturers: string;
}
