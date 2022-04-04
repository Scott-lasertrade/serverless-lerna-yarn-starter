import { Account } from './Account';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';
import { UserLoginHistory } from './UserLoginHistory';
export declare class User extends VersionControlledEntity {
    cognito_user_id: string;
    hubspot_user_id: string;
    enabled: boolean;
    accounts: Account[];
    login_history: UserLoginHistory[];
}
//# sourceMappingURL=User.d.ts.map