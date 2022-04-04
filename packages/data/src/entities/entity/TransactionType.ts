import { Entity, Column, OneToMany } from 'typeorm';
import { CommonEntity } from '../utils/CommonEntity';
import { Transaction } from './Transaction';

@Entity('transaction_type')
export class TransactionType extends CommonEntity {
    // FKS

    // COLUMNS
    @Column()
    name: string;

    // EXTERNAL JOINS
    @OneToMany(() => Transaction, (transaction) => transaction.type)
    transactions: Transaction[];
}
