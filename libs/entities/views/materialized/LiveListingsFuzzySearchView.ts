import { ViewEntity, Column } from 'typeorm';

@ViewEntity({
    name: 'live_listings_fuzzy_search_view',
    expression: `
        select word from ts_stat(
            'select setweight(to_tsvector(cast(l."YOM" as text)), ''A'') || '' '' || setweight(to_tsvector(''simple'', p.name), ''B'') || '' '' || 
                setweight(to_tsvector(''simple'', coalesce((string_agg(m.name, '' '')), '''')), ''C'') 
                as document 
            from listing l
            inner join product p on l."productId" = p.id and p.deleted_date is null
            inner join listing_status ls on ls.id = l."listingStatusId" 
            left join product_to_manufacturer ptm on ptm.product = p.id
            left join manufacturer m on m.id = ptm.manufacturer 
            where ls.name = ''Listed'' 
            and p.is_active = ''1'' 
            and p.is_draft = ''0''
            group by l.id, p.id'
        )
    `,
    materialized: true,
})
export class LiveListingsFuzzySearchView {
    @Column({ type: 'text' })
    word: string;
}
