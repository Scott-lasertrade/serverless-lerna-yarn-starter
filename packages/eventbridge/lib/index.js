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
exports.sendToEventBridge = void 0;
const client_eventbridge_1 = require("@aws-sdk/client-eventbridge");
const sendToEventBridge = (bridgeName, event, stage) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, type } = event;
    let client = new client_eventbridge_1.EventBridgeClient({ region: 'ap-southeast-2' });
    if (stage === 'offline') {
        client = new client_eventbridge_1.EventBridgeClient({
            endpoint: 'http://127.0.0.1:4010',
            region: 'ap-southeast-2',
        });
    }
    console.log(`Sending event ${id} of type ${type} to the ${bridgeName} event bus on AWS EventBridge`);
    const params = {
        Entries: [
            {
                Detail: JSON.stringify(event),
                DetailType: type,
                EventBusName: `${bridgeName}-${stage}`,
                Source: bridgeName.charAt(0).toUpperCase() + bridgeName.slice(1),
            },
        ],
    };
    try {
        console.log(`Sending event...`, params);
        const command = new client_eventbridge_1.PutEventsCommand(params);
        const data = yield client.send(command);
        console.log(`Sent event ${id}`, data);
    }
    catch (err) {
        console.error('Error while sending event', err);
        return err;
    }
});
exports.sendToEventBridge = sendToEventBridge;
//# sourceMappingURL=index.js.map