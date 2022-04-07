"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const entities = __importStar(require("./entities"));
const subscribers = __importStar(require("./entities/subscriptions"));
const migrations = __importStar(require("./entities/migrations"));
let config = {
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
if (process.env.SECRET_ARN &&
    !process.env.IS_OFFLINE &&
    !process.env.IS_LOCAL) {
    config = {
        type: 'aurora-data-api-pg',
        database: (_a = process.env.DATABASE_NAME) !== null && _a !== void 0 ? _a : '',
        secretArn: process.env.SECRET_ARN,
        resourceArn: (_b = process.env.AURORA_DB_ARN) !== null && _b !== void 0 ? _b : '',
        region: (_c = process.env.REGION) !== null && _c !== void 0 ? _c : 'ap-southeast-2',
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
exports.default = config;
//# sourceMappingURL=ormconfig.js.map