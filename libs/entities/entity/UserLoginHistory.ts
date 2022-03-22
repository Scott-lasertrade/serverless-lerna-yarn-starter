import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity('user_login_history')
export class UserLoginHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamptz' })
    date: Date;

    @ManyToOne(() => User, (user) => user.login_history, {
        nullable: true,
    })
    user: User;
}
