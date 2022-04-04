import { ViewEntity, ViewColumn, Column } from 'typeorm';

@ViewEntity({
    name: 'live_listings_advanced_view',
    expression: `
        select  l.id,
        p.id as "productId",
        l."YOM",
        p.name as "productName",
        m.name as "manufacturer",
        l."cost" as price,
        ls."name" as status,
        l.create_at as created_on,
        li.key as thumbnail_key,
        li.bucket as thumbnail_bucket,
        li.region as thumbnail_region,
        c.id as category,
        setweight(to_tsvector(cast(l."YOM" as text)), 'A') || ' ' ||
        setweight(to_tsvector(p.name), 'B') || ' ' || 
        setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'C') 
        as document
    from listing l
    inner join product p on l."productId" = p.id and p.deleted_date is null
    inner join listing_status ls on ls.id = l."listingStatusId"
    left join category_to_product ctp on ctp.product = p.id
    left join category c on c.id = ctp.category
    left join listing_image li on li."listingId" = l.id and li.order = 0 and li.deleted_date is null
    left join product_to_manufacturer ptm on ptm.product = p.id
    left join manufacturer m on m.id = ptm.manufacturer 
    where ls.name in ('Listed', 'Sold') 
    and p.is_active = '1' 
    and p.is_draft = '0'
    group by l.id, p.id, li.id, ls.id, m.id, c.id
    `,
    materialized: true,
})
export class LiveListingsAdvancedView {
    @ViewColumn()
    id: number;

    @ViewColumn()
    productId: number;

    @ViewColumn()
    title: string;

    @ViewColumn()
    price: number;

    @ViewColumn()
    status: string;

    @ViewColumn()
    thumbnail_key: string;

    @ViewColumn()
    thumbnail_bucket: string;

    @ViewColumn()
    thumbnail_region: string;

    @ViewColumn()
    manufacturer: string;

    @ViewColumn()
    category: number;

    @Column({ type: 'tsvector' })
    document: string;
}
