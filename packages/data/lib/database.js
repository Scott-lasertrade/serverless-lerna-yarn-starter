"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
require("typeorm-aurora-data-api-driver");
const RelationLoader_1 = require("typeorm/query-builder/RelationLoader");
const ormconfig_1 = __importDefault(require("./ormconfig"));
class Database {
    constructor() {
        this.connectionManager = typeorm_1.getConnectionManager();
    }
    getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const CONNECTION_NAME = `default`;
            let connection;
            if (this.connectionManager.has(CONNECTION_NAME)) {
                console.log('Use existing connection...');
                connection = this.injectConnectionOptions(this.connectionManager.get(), ormconfig_1.default);
            }
            else {
                console.log(`Create new connection...`);
                connection = yield typeorm_1.createConnection(ormconfig_1.default);
            }
            return connection;
        });
    }
    injectConnectionOptions(connection, connectionOptions) {
        // S.Y: SEE - https://github.com/typeorm/typeorm/issues/2598
        // @ts-ignore
        connection.options = connectionOptions;
        // @ts-ignore
        connection.manager = connection.createEntityManager();
        // @ts-ignore
        connection.namingStrategy =
            // @ts-ignore
            connection.options.namingStrategy || new typeorm_1.DefaultNamingStrategy();
        // @ts-ignore
        connection.relationLoader = new RelationLoader_1.RelationLoader(connection);
        // @ts-ignore
        connection.buildMetadatas();
        return connection;
    }
}
exports.default = Database;
