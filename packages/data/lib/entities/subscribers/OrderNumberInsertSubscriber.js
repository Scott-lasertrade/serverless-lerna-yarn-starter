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
exports.OrderNumberInsertSubscriber = void 0;
const typeorm_1 = require("typeorm");
const Order_1 = require("../entity/Order");
const OrderHistory_1 = require("../entity/OrderHistory");
let OrderNumberInsertSubscriber = class OrderNumberInsertSubscriber {
    listenTo() {
        return Order_1.Order;
    }
    afterInsert(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            event.entity.order_number = `ORD${now
                .toISOString()
                .split('T')[0]
                .split('-')
                .join('')}${event.entity.id}`;
            const newOrder = yield event.manager
                .getRepository(Order_1.Order)
                .save(event.entity);
            yield this.addHistory(newOrder, event.manager);
        });
    }
    addHistory(entity, entityManager) {
        return __awaiter(this, void 0, void 0, function* () {
            let orderHistory = new OrderHistory_1.OrderHistory();
            orderHistory.order = entity;
            orderHistory.listing = entity.listing;
            orderHistory.status = entity.status;
            orderHistory.buyer = entity.buyer;
            orderHistory.checkout = entity.checkout;
            orderHistory.order_number = entity.order_number;
            orderHistory.total = entity.total;
            orderHistory.paid = entity.paid;
            orderHistory.deposit = entity.deposit;
            orderHistory.fixed_fee = entity.fixed_fee;
            orderHistory.variable_fee = entity.variable_fee;
            yield entityManager.getRepository(OrderHistory_1.OrderHistory).save(orderHistory);
        });
    }
    afterUpdate(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('EventSubscriber History->Order Update Triggered');
            yield this.addHistory(event.entity, event.manager);
        });
    }
};
OrderNumberInsertSubscriber = __decorate([
    typeorm_1.EventSubscriber()
], OrderNumberInsertSubscriber);
exports.OrderNumberInsertSubscriber = OrderNumberInsertSubscriber;
