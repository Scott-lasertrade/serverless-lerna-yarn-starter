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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useS3Versioning1636589107973 = void 0;
class useS3Versioning1636589107973 {
    constructor() {
        this.name = 'useS3Versioning1636589107973';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "listing_image" RENAME COLUMN "version" TO "s3VersionId"`);
            yield queryRunner.query(`ALTER TABLE "product_image" RENAME COLUMN "version" TO "s3VersionId"`);
            yield queryRunner.query(`ALTER TABLE "listing_image" DROP COLUMN "s3VersionId"`);
            yield queryRunner.query(`ALTER TABLE "listing_image" ADD "s3VersionId" character varying NOT NULL DEFAULT '0'`);
            yield queryRunner.query(`ALTER TABLE "product_image" DROP COLUMN "s3VersionId"`);
            yield queryRunner.query(`ALTER TABLE "product_image" ADD "s3VersionId" character varying NOT NULL DEFAULT '0'`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "product_image" DROP COLUMN "s3VersionId"`);
            yield queryRunner.query(`ALTER TABLE "product_image" ADD "s3VersionId" integer NOT NULL`);
            yield queryRunner.query(`ALTER TABLE "listing_image" DROP COLUMN "s3VersionId"`);
            yield queryRunner.query(`ALTER TABLE "listing_image" ADD "s3VersionId" integer NOT NULL`);
            yield queryRunner.query(`ALTER TABLE "product_image" RENAME COLUMN "s3VersionId" TO "version"`);
            yield queryRunner.query(`ALTER TABLE "listing_image" RENAME COLUMN "s3VersionId" TO "version"`);
        });
    }
}
exports.useS3Versioning1636589107973 = useS3Versioning1636589107973;
