import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
    name: 'product_submissions_view',
    expression: `
        select 	p.id, 
            coalesce((string_agg(m.name, ' ')), '') || ' ' || p.name  as title, 
            pi2.key as thumbnail_key,
            pi2.bucket as thumbnail_bucket,
            pi2.region as thumbnail_region,
            p.create_at,
            case when COUNT(CASE WHEN m.is_approved THEN null else 1 END) > 0 then 1 else 0 end as requires_approval
    from public.product p
    left join product_to_manufacturer ptm on ptm.product = p.id
    left join manufacturer m on m.id = ptm.manufacturer 
    left join product_image pi2 on pi2."productId" = p.id and pi2.order = 0
    where p.id in (select "productId" from listing where "productId" = p.id) And p.deleted_date is null and pi2.deleted_date is null
    and p.is_active = '1' and p.is_draft = '1'
    group by p.id, pi2.id
    `,
})
export class ProductSubmissionsView {
    @ViewColumn()
    id: number;

    @ViewColumn()
    title: string;

    @ViewColumn()
    thumbnail_key: string;

    @ViewColumn()
    thumbnail_bucket: string;

    @ViewColumn()
    thumbnail_region: string;

    @ViewColumn()
    requires_approval: boolean;

    @ViewColumn()
    create_at: Date;
}
