"use strict";
// import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
// import { CategoryFunction } from './CategoryFunction';
// import { CommonEntity } from '../utils/CommonEntity';
// @Entity('category_treatment')
// export class CategoryTreatment extends CommonEntity {
//     @Column()
//     name: string;
//     @ManyToMany(
//         () => CategoryFunction,
//         (categoryFunction) => categoryFunction.category_treatments
//     )
//     @JoinTable({
//         name: 'category_treatment_to_function',
//         joinColumn: {
//             name: 'category_treatment',
//             referencedColumnName: 'id',
//         },
//         inverseJoinColumn: {
//             name: 'category_function',
//             referencedColumnName: 'id',
//         },
//     })
//     category_functions: CategoryFunction[];
//     addFunction(categoryFunction: CategoryFunction) {
//         if (this.category_functions == null) {
//             this.category_functions = new Array<CategoryFunction>();
//         }
//         this.category_functions.push(categoryFunction);
//     }
//     removeFunction(category_function: CategoryFunction) {
//         if (this.category_functions == null) {
//             return;
//         }
//         this.category_functions = this.category_functions.filter(
//             (itm) => itm.name !== category_function.name
//         );
//     }
// }
