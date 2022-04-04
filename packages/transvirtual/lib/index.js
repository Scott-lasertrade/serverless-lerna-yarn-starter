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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimatePrice = exports.ItemDimension = void 0;
const common_1 = require("@medii/common");
const axios_1 = __importDefault(require("axios"));
class ItemDimension {
    constructor(weight, length, width, height) {
        this.Quantity = 1;
        this.Weight = weight;
        this.Length = length;
        this.Width = width;
        this.Height = height;
        this.Description = 'box';
    }
}
exports.ItemDimension = ItemDimension;
const transvirtualInstance = axios_1.default.create({
    baseURL: 'https://api.transvirtual.com.au/Api',
    timeout: 30000,
    headers: {
        Authorization: (_a = process.env.TVAPIKEY) !== null && _a !== void 0 ? _a : '',
    },
});
const SHIPPING_ESTIMATE_MULTILPLIER = 1.15;
const estimatePrice = (senderSuburb, senderState, senderPostcode, receiverSuburb, receiverState, receiverPostcode, items) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const response = yield transvirtualInstance.post('/PriceEstimate', {
            CustomerCode: process.env.TVCUSTOMER_CODE,
            SenderSuburb: senderSuburb,
            SenderState: senderState,
            SenderPostcode: senderPostcode,
            ReceiverSuburb: receiverSuburb,
            ReceiverState: receiverState,
            ReceiverPostcode: receiverPostcode,
            DimensionsUOM: 'cm',
            WeightUOM: 'kgs',
            Rows: items.map((itm) => ({
                QtyDecimal: itm.Quantity,
                Weight: itm.Weight,
                Length: itm.Length,
                Width: itm.Width,
                Height: itm.Height,
                Description: itm.Description,
            })),
        });
        console.log('TRANSVIRTUAL| Response: ', response.data);
        if (((_c = (_b = response.data.Data) === null || _b === void 0 ? void 0 : _b.Rows) === null || _c === void 0 ? void 0 : _c.length) > 0) {
            console.log(response.data.Data.Rows);
            let toReturn = response.data.Data.Rows.filter((row) => row.Title === 'Rite On Site');
            if (toReturn.length > 0) {
                return (Math.round(Number(toReturn[0].GrandPrice) *
                    SHIPPING_ESTIMATE_MULTILPLIER *
                    100) / 100);
            }
            toReturn = response.data.Data.Rows.sort((a, b) => parseFloat(b.GrandPrice) - parseFloat(a.GrandPrice));
            return (Math.round(Number(toReturn[0].GrandPrice) *
                SHIPPING_ESTIMATE_MULTILPLIER *
                100) / 100);
        }
        else {
            throw new common_1.AppError('Could not calculate shipping invalid params provided');
        }
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
            else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            }
            else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        }
        else {
            console.log('Unexpected Error', error);
        }
        throw new common_1.AppError(`Unexpected error: ${error}`);
    }
});
exports.estimatePrice = estimatePrice;
