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
exports.Question1644974057931 = void 0;
class Question1644974057931 {
    constructor() {
        this.name = 'Question1644974057931';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "deleted_date" TIMESTAMP, "question" character varying, "answer" character varying, "listingId" integer, "askerId" integer, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_7ff100790c3fd984889e7f687a8" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_8bd7497b93b24446bda7e61d1e4" FOREIGN KEY ("askerId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_8bd7497b93b24446bda7e61d1e4"`);
            yield queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_7ff100790c3fd984889e7f687a8"`);
            yield queryRunner.query(`DROP TABLE "question"`);
        });
    }
}
exports.Question1644974057931 = Question1644974057931;
//# sourceMappingURL=1644974057931-Question.js.map