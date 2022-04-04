import { Listing } from './Listing';
import { Account } from './Account';
import { VersionControlledEntity } from '../utils/VersionControlledEntity';
export declare class Question extends VersionControlledEntity {
    listing: Listing;
    asker: Account;
    question: string;
    answer: string;
}
//# sourceMappingURL=Question.d.ts.map