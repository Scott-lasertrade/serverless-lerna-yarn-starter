import { ConnectionOptions } from 'typeorm';
import * as entities from './entities';
import * as subscribers from './entities/subscriptions';
import * as migrations from './entities/migrations';

let config: ConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'admin',
    database: 'postgres',
    entities: [...Object.values(entities)],
    subscribers: [...Object.values(subscribers)],
    migrations: [...Object.values(migrations)],
    cli: {
        entitiesDir: 'src/entities/entity',
        subscribersDir: 'src/entities/subscribers',
        migrationsDir: 'src/entities/migration',
    },
};

if (
    process.env.SECRET_ARN &&
    !process.env.IS_OFFLINE &&
    !process.env.IS_LOCAL
) {
    config = {
        type: 'aurora-data-api-pg',
        database: process.env.DATABASE_NAME ?? '',
        secretArn: process.env.SECRET_ARN,
        resourceArn: process.env.AURORA_DB_ARN ?? '',
        region: process.env.REGION ?? 'ap-southeast-2',
        name: 'default',
        entities: [...Object.values(entities)],
        subscribers: [...Object.values(subscribers)],
        migrations: [...Object.values(migrations)],
        cli: {
            entitiesDir: 'src/entities/entity',
            subscribersDir: 'src/entities/subscribers',
            migrationsDir: 'src/entities/migration',
        },
    };
}

export default config;
