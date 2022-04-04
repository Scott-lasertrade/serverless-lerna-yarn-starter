import { ViewEntity, ViewColumn, Column } from 'typeorm';

@ViewEntity({
    name: 'product_search_view',
    expression: `
        select 	p.id, 
                coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, 
                p.is_draft as is_draft,
                p.is_active as is_active,
                pi2.key as thumbnail_key,
                pi2.bucket as thumbnail_bucket,
                pi2.region as thumbnail_region,
                setweight(to_tsvector(p.name), 'A') || ' ' || 
                setweight(to_tsvector(coalesce((string_agg(m.name, ' ')), '')), 'B') 
                as document 
        from public.product p
        left join product_to_manufacturer ptm on ptm.product = p.id
        left join manufacturer m on m.id = ptm.manufacturer 
        left join product_image pi2 on pi2."productId" = p.id and pi2.order = 0
        where p.deleted_date is null and pi2.deleted_date is null
        group by p.id, pi2.id
    `,
    materialized: true,
})
export class ProductSearchView {
    @ViewColumn()
    id: number;

    @ViewColumn()
    title: string;

    @ViewColumn()
    is_draft: boolean;

    @ViewColumn()
    is_active: boolean;

    @ViewColumn()
    thumbnail_key: string;

    @ViewColumn()
    thumbnail_bucket: string;

    @ViewColumn()
    thumbnail_region: string;

    @Column({ type: 'tsvector' })
    document: string;
}
