import { ViewEntity, ViewColumn, Column } from 'typeorm';

@ViewEntity({
    name: 'manufacturer_search_view',
    expression: `
        select 	m.id,
                name,
                m.is_approved,
                to_tsvector(name) as document
        from manufacturer m 
    `,
    materialized: true,
})
export class ManufacturerSearchView {
    @ViewColumn()
    id: number;

    @ViewColumn()
    is_approved: boolean;

    @ViewColumn()
    name: string;

    @Column({ type: 'tsvector' })
    document: string;
}
