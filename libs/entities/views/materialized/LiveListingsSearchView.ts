import { ViewEntity, ViewColumn, Column } from 'typeorm';

@ViewEntity({
    name: 'live_listings_search_view',
    expression: `
        select  l.id,
                p.id as "productId",
                coalesce(cast(l."YOM" as text), '') || ' ' || coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name as title, 
                l."cost" as price,
                li.key as thumbnail_key,
                li.bucket as thumbnail_bucket,
                li.region as thumbnail_region,
                setweight(to_tsvector(cast(l."YOM" as text)), 'A') || ' ' ||
                setweight(to_tsvector(p.name), 'B') || ' ' || 
                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') 
                as document 
        from listing l
        inner join product p on l."productId" = p.id and p.deleted_date is null
        inner join listing_status ls on ls.id = l."listingStatusId"
        left join listing_image li on li."listingId" = l.id and li.order = 0 and li.deleted_date is null
        left join product_to_manufacturer ptm on ptm.product = p.id
        left join manufacturer m on m.id = ptm.manufacturer 
        where ls.name = 'Listed' 
        and p.is_active = '1' 
        and p.is_draft = '0'
        group by l.id, p.id, li.id
    `,
    materialized: true,
})
export class LiveListingsSearchView {
    @ViewColumn()
    id: number;

    @ViewColumn()
    productId: number;

    @ViewColumn()
    title: string;

    @ViewColumn()
    price: number;

    @ViewColumn()
    thumbnail_key: string;

    @ViewColumn()
    thumbnail_bucket: string;

    @ViewColumn()
    thumbnail_region: string;

    @Column({ type: 'tsvector' })
    document: string;
}
