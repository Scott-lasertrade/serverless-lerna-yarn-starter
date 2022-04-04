import { Connection } from 'typeorm';
import 'typeorm-aurora-data-api-driver';
export default class Database {
    private connectionManager;
    constructor();
    getConnection(): Promise<Connection>;
    private injectConnectionOptions;
}
//# sourceMappingURL=database.d.ts.map