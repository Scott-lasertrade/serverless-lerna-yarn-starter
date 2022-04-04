import { CommonEntity } from '../utils/CommonEntity';
import { Product } from './Product';
export declare class Category extends CommonEntity {
    key: string;
    name: string;
    parent_id?: number;
    parent?: Category;
    products: Product[];
}
//# sourceMappingURL=Category.d.ts.map