import {
    Connection,
    ConnectionManager,
    ConnectionOptions,
    createConnection,
    DefaultNamingStrategy,
    getConnectionManager,
} from 'typeorm';
import 'typeorm-aurora-data-api-driver';
import { RelationLoader } from 'typeorm/query-builder/RelationLoader';
import config from './ormconfig';

export default class Database {
    private connectionManager: ConnectionManager;

    constructor() {
        this.connectionManager = getConnectionManager();
    }

    public async getConnection(): Promise<Connection> {
        const CONNECTION_NAME = `default`;

        let connection: Connection;

        if (this.connectionManager.has(CONNECTION_NAME)) {
            console.log('Use existing connection...');
            connection = this.injectConnectionOptions(
                this.connectionManager.get(),
                config
            );
        } else {
            console.log(`Create new connection...`);

            connection = await createConnection(config);
        }

        return connection;
    }

    private injectConnectionOptions(
        connection: Connection,
        connectionOptions: ConnectionOptions
    ): Connection {
        // S.Y: SEE - https://github.com/typeorm/typeorm/issues/2598
        // @ts-ignore
        connection.options = connectionOptions;
        // @ts-ignore
        connection.manager = connection.createEntityManager();
        // @ts-ignore
        connection.namingStrategy =
            // @ts-ignore
            connection.options.namingStrategy || new DefaultNamingStrategy();
        // @ts-ignore
        connection.relationLoader = new RelationLoader(connection);
        // @ts-ignore
        connection.buildMetadatas();
        return connection;
    }
}
