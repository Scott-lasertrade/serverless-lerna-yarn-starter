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
exports.startStateMachine = void 0;
const client_sfn_1 = require("@aws-sdk/client-sfn");
exports.startStateMachine = (stateMachineARN, offlineStateMachineARN, data, offlineMode = false) => __awaiter(void 0, void 0, void 0, function* () {
    let config = { region: 'ap-southeast-2' };
    let params;
    let currentStateMachine = stateMachineARN;
    if (offlineMode) {
        currentStateMachine = offlineStateMachineARN;
        config = {
            region: 'ap-southeast-2',
            endpoint: 'http://localhost:8083',
        };
    }
    params = {
        stateMachineArn: currentStateMachine,
        input: JSON.stringify(data),
    };
    const client = new client_sfn_1.SFNClient(config);
    console.log('State Machine|Initiating...');
    try {
        const command = new client_sfn_1.StartExecutionCommand(params);
        yield client.send(command);
        console.log('State Machine|Initiated');
    }
    catch (err) {
        console.log('State Machine|Failed to Initiate', err);
    }
});
//# sourceMappingURL=index.js.map