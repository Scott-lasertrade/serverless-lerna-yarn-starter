import {
    Entity,
    Column,
    ManyToMany,
    JoinTable,
    Unique,
    OneToMany,
} from 'typeorm';
import { Account } from './Account';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';
import { UserLoginHistory } from './UserLoginHistory';

@Entity('user')
@Unique(['cognito_user_id'])
export class User extends VersionControlledEntity {
    @Column()
    cognito_user_id: string;

    @Column({ default: 'Manually replace' })
    hubspot_user_id: string;

    @Column({ default: true })
    enabled: boolean;

    @ManyToMany(() => Account, (account) => account.users)
    @JoinTable({
        name: 'account_to_user',
        joinColumn: {
            name: 'user',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'account',
            referencedColumnName: 'id',
        },
    })
    accounts: Account[];

    @OneToMany(() => UserLoginHistory, (login_history) => login_history.user, {
        cascade: true,
    })
    login_history: UserLoginHistory[];
}
