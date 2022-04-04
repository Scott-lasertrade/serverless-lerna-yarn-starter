import { ViewEntity, Column } from 'typeorm';

@ViewEntity({
    name: 'product_fuzzy_search_view',
    expression: `
        select word from ts_stat(
            'select setweight(to_tsvector(''simple'', p.name), ''A'') || '' '' || 
                    setweight(to_tsvector(''simple'', coalesce((string_agg(m.name, '' '')), '''')), ''B'') 
                    as document 
            from public.product p
            left join product_to_manufacturer ptm on ptm.product = p.id
            left join manufacturer m on m.id = ptm.manufacturer 
            where p.deleted_date is null
            group by p.id'
        )
    `,
    materialized: true,
})
export class ProductFuzzySearchView {
    @Column({ type: 'text' })
    word: string;
}
