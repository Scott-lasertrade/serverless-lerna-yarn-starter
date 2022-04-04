import { ViewEntity, Column } from 'typeorm';

@ViewEntity({
    name: 'manufacturer_fuzzy_search_view',
    expression: `
        select word from ts_stat('
            select 	to_tsvector(''simple'', name) as document 
            from manufacturer m'
        )
    `,
    materialized: true,
})
export class ManufacturerFuzzySearchView {
    @Column({ type: 'text' })
    word: string;
}
