"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.OfferHistoryAddition = void 0;
const typeorm_1 = require("typeorm");
const Offer_1 = require("../entity/Offer");
const OfferHistory_1 = require("../entity/OfferHistory");
let OfferHistoryAddition = class OfferHistoryAddition {
    listenTo() {
        return Offer_1.Offer;
    }
    afterInsert(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('EventSubscriber History->Insert Triggered');
            yield this.addHistory(event);
        });
    }
    addHistory(event) {
        return __awaiter(this, void 0, void 0, function* () {
            let offerHistory = new OfferHistory_1.OfferHistory();
            offerHistory.status = event.entity.status;
            offerHistory.value = event.entity.value;
            offerHistory.date = new Date();
            offerHistory.offer = new Offer_1.Offer(event.entity.id);
            yield event.manager.getRepository(OfferHistory_1.OfferHistory).save(offerHistory);
        });
    }
    afterUpdate(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('EventSubscriber History->Update Triggered');
            yield this.addHistory(event);
        });
    }
};
OfferHistoryAddition = __decorate([
    typeorm_1.EventSubscriber()
], OfferHistoryAddition);
exports.OfferHistoryAddition = OfferHistoryAddition;
//# sourceMappingURL=OfferHistoryAddition.js.map