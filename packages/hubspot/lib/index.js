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
exports.addHSDeal = exports.getHSDeal = exports.addQuestionReportTicket = exports.addReportTicket = exports.associateContactWithTask = exports.getHSDueDate = exports.addHSTask = exports.updateHSContact = exports.addHSContact = exports.associateContactWithCompany = exports.addHSCompany = void 0;
const hubspot = __importStar(require("@hubspot/api-client"));
const common_1 = require("@medii/common");
const axios_1 = __importDefault(require("axios"));
const hubspotClient = new hubspot.Client({ apiKey: process.env.HAPIKEY });
const addHSCompany = (businessName, businessPhoneNumber, connectHSContacts) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const apiResponse = yield hubspotClient.crm.companies.basicApi.create({
            properties: {
                name: businessName,
                phone: businessPhoneNumber,
            },
        });
        console.log('Hubspot Company: ', apiResponse.id);
        yield Promise.all(connectHSContacts.map((contactId) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, exports.associateContactWithCompany)(contactId, apiResponse.id);
        })));
        return apiResponse.id;
    }
    catch (e) {
        const error = e.message === 'HTTP request failed'
            ? JSON.stringify(e.response, null, 2)
            : e;
        if ((_c = (_b = (_a = e.response) === null || _a === void 0 ? void 0 : _a.body) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.startsWith('Company already exists. Existing ID: ')) {
            try {
                const companyId = (_f = (_e = (_d = e.response) === null || _d === void 0 ? void 0 : _d.body) === null || _e === void 0 ? void 0 : _e.message) === null || _f === void 0 ? void 0 : _f.replace('Company already exists. Existing ID: ', '');
                const apiResponse = yield hubspotClient.crm.companies.basicApi.getById(companyId);
                console.log('Hubspot Company: ', apiResponse.id);
                return apiResponse.id;
            }
            catch (e) {
                const error = e.message === 'HTTP request failed'
                    ? JSON.stringify(e.response, null, 2)
                    : e;
                console.error(error);
                throw new common_1.AppError(error);
            }
        }
        else {
            throw new common_1.AppError(error);
        }
    }
});
exports.addHSCompany = addHSCompany;
const associateContactWithCompany = (contactId, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const BatchInputPublicAssociation = {
            inputs: [
                {
                    _from: { id: contactId },
                    to: { id: companyId },
                    type: 'contact_to_company',
                },
            ],
        };
        const fromObjectType = 'contact';
        const toObjectType = 'company';
        const apiResponse = yield hubspotClient.crm.associations.batchApi.create(fromObjectType, toObjectType, BatchInputPublicAssociation);
        console.log('Associated Company: ', apiResponse.results);
        return apiResponse.results;
    }
    catch (e) {
        const error = e.message === 'HTTP request failed'
            ?
                JSON.stringify(e.response, null, 2)
            : e;
        throw new common_1.AppError(error);
    }
});
exports.associateContactWithCompany = associateContactWithCompany;
const addHSContact = (emailAddress, firstName) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j, _k, _l, _m;
    try {
        const apiResponse = yield hubspotClient.crm.contacts.basicApi.create({
            properties: {
                email: emailAddress,
                firstname: firstName,
            },
        });
        console.log('Hubspot Contact: ', apiResponse.id);
        return apiResponse.id;
    }
    catch (e) {
        const error = e.message === 'HTTP request failed'
            ?
                JSON.stringify(e.response, null, 2)
            : e;
        if ((_j = (_h = (_g = e.response) === null || _g === void 0 ? void 0 : _g.body) === null || _h === void 0 ? void 0 : _h.message) === null || _j === void 0 ? void 0 : _j.startsWith('Contact already exists. Existing ID: ')) {
            try {
                const contactId = (_m = (_l = (_k = e.response) === null || _k === void 0 ? void 0 : _k.body) === null || _l === void 0 ? void 0 : _l.message) === null || _m === void 0 ? void 0 : _m.replace('Contact already exists. Existing ID: ', '');
                const apiResponse = yield hubspotClient.crm.contacts.basicApi.getById(contactId);
                console.log('Hubspot Contact: ', apiResponse.id);
                return apiResponse.id;
            }
            catch (e) {
                const error = e.message === 'HTTP request failed'
                    ?
                        JSON.stringify(e.response, null, 2)
                    : e;
                console.error(error);
                throw new common_1.AppError(error);
            }
        }
        else {
            throw new common_1.AppError(error);
        }
    }
});
exports.addHSContact = addHSContact;
const updateHSContact = (HsId, firstName, lastName, phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiResponse = yield hubspotClient.crm.contacts.basicApi.update(HsId, {
            properties: {
                firstname: firstName,
                lastname: lastName,
                phone: phoneNumber,
            },
        });
        console.log('Hubspot Contact Updated: ', apiResponse.id);
        return apiResponse.id;
    }
    catch (e) {
        const error = e.message === 'HTTP request failed'
            ?
                JSON.stringify(e.response, null, 2)
            : e;
        throw new common_1.AppError(error);
    }
});
exports.updateHSContact = updateHSContact;
function convertTZ(date, tzString) {
    return new Date((typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', {
        timeZone: tzString,
    }));
}
const addHSTask = (taskBody, taskHeader) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let dueDate = (0, exports.getHSDueDate)(new Date());
        const task = yield axios_1.default.post(`https://api.hubapi.com/crm/v3/objects/tasks?hapikey=${process.env.HAPIKEY}`, {
            properties: {
                hs_timestamp: dueDate.toISOString(),
                hs_task_body: taskBody,
                hs_task_subject: taskHeader,
                hs_task_status: 'WAITING',
                hs_task_priority: 'HIGH',
                hs_task_type: 'TODO',
            },
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('TASK: ', task.data);
        return task.data;
    }
    catch (e) {
        const error = e.message === 'HTTP request failed'
            ?
                JSON.stringify(e.response, null, 2)
            : e;
        throw new common_1.AppError(error);
    }
});
exports.addHSTask = addHSTask;
const getHSDueDate = (dateIssued) => {
    let nowAEST = convertTZ(dateIssued, 'Australia/Sydney');
    const isWeekend = nowAEST.getDay() % 6 === 0;
    const isFridayAfternoon = nowAEST.getDay() % 6 === 5 && nowAEST.getHours() >= 16;
    const isMondayMorning = nowAEST.getDay() % 6 === 1 && nowAEST.getHours() < 9;
    const isWorkHours = nowAEST.getHours() >= 9 && nowAEST.getHours() < 16;
    const anHour = 1000 * 60 * 60;
    let dueDate = new Date(nowAEST.getTime());
    if (isWeekend || !isWorkHours || isFridayAfternoon || isMondayMorning) {
        if (isWeekend || isFridayAfternoon || isMondayMorning) {
            const monday = isMondayMorning
                ? 0
                : isFridayAfternoon
                    ? 3
                    : nowAEST.getDay() === 6
                        ? 2
                        : 1;
            dueDate.setDate(dueDate.getDate() + monday);
        }
        else {
            if (nowAEST.getHours() >= 16) {
                dueDate.setDate(dueDate.getDate() + 1);
            }
        }
        dueDate.setHours(10);
        dueDate.setMinutes(0);
        dueDate.setSeconds(0);
        dueDate.setMilliseconds(0);
    }
    else {
        dueDate = new Date(nowAEST.getTime() + anHour);
    }
    return dueDate;
};
exports.getHSDueDate = getHSDueDate;
const associateContactWithTask = (contactId, taskId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const association = yield axios_1.default.put(`https://api.hubapi.com/crm/v3/objects/tasks/${taskId}/associations/contacts/${contactId}/204?hapikey=${process.env.HAPIKEY}`, {}, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('ASSOCIATION: ', association.data);
        return association.data;
    }
    catch (e) {
        const error = e.message === 'HTTP request failed'
            ?
                JSON.stringify(e.response, null, 2)
            : e;
        throw new common_1.AppError(error);
    }
});
exports.associateContactWithTask = associateContactWithTask;
const addReportTicket = (accountId, listingId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const properties = {
        hs_pipeline: '0',
        hs_pipeline_stage: '1',
        hs_ticket_priority: 'HIGH',
        subject: 'troubleshoot report',
        content: 'For Listing ' +
            listingId.toString() +
            ' On Page ' +
            `https://www.lasersharks.click/product/${productId}/listing/${listingId}`,
    };
    const SimplePublicObjectInput = { properties };
    try {
        const apiResponse = yield hubspotClient.crm.tickets.basicApi.create(SimplePublicObjectInput);
        const ticketId = apiResponse.id;
        const toObjectType = 'contact';
        const toObjectId = accountId.toString();
        const associationType = 'ticket_to_contact';
        try {
            const finalResponse = yield hubspotClient.crm.tickets.associationsApi.create(ticketId, toObjectType, toObjectId, associationType);
            console.log(JSON.stringify(apiResponse, null, 2));
            return finalResponse;
        }
        catch (e) {
            e.message === 'HTTP request failed'
                ?
                    console.error(JSON.stringify(e.response, null, 2))
                : console.error(e);
            throw new common_1.AppError(e);
        }
    }
    catch (e) {
        e.message === 'HTTP request failed'
            ?
                console.error(JSON.stringify(e.response, null, 2))
            : console.error(e);
        throw new common_1.AppError(e);
    }
});
exports.addReportTicket = addReportTicket;
const addQuestionReportTicket = (accountId, questionId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`HUBSPOT| addQuestionReportTicket - Question Id [${questionId}]`);
    const properties = {
        hs_pipeline: '0',
        hs_pipeline_stage: '1',
        hs_ticket_priority: 'HIGH',
        subject: 'question troubleshoot report',
        content: 'For Question ' + questionId.toString(),
    };
    const SimplePublicObjectInput = { properties };
    try {
        const apiResponse = yield hubspotClient.crm.tickets.basicApi.create(SimplePublicObjectInput);
        const ticketId = apiResponse.id;
        const toObjectType = 'contact';
        const toObjectId = accountId.toString();
        const associationType = 'ticket_to_contact';
        try {
            const finalResponse = yield hubspotClient.crm.tickets.associationsApi.create(ticketId, toObjectType, toObjectId, associationType);
            console.log(JSON.stringify(apiResponse, null, 2));
            return finalResponse;
        }
        catch (e) {
            e.message === 'HTTP request failed'
                ?
                    console.error(JSON.stringify(e.response, null, 2))
                : console.error(e);
            throw new common_1.AppError(e);
        }
    }
    catch (e) {
        e.message === 'HTTP request failed'
            ?
                console.error(JSON.stringify(e.response, null, 2))
            : console.error(e);
        throw new common_1.AppError(e);
    }
});
exports.addQuestionReportTicket = addQuestionReportTicket;
const getHSDeal = (dealId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const properties = undefined;
        const propertiesWithHistory = undefined;
        const associations = undefined;
        const archived = false;
        const idProperty = undefined;
        const deal = yield hubspotClient.crm.deals.basicApi.getById(dealId, properties, propertiesWithHistory, associations, archived, idProperty);
        return deal;
    }
    catch (e) {
        const error = e.message === 'HTTP request failed'
            ?
                JSON.stringify(e.response, null, 2)
            : e;
        throw new common_1.AppError(error);
    }
});
exports.getHSDeal = getHSDeal;
const addHSDeal = (hSBuyerId, buyerName, buyerPhone, buyerAddress, hSSellerId, sellerAddress, amount, dealName, listingUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seller = yield hubspotClient.crm.contacts.basicApi.getById(hSSellerId, ['firstname']);
        const apiResponse = yield hubspotClient.crm.deals.basicApi.create({
            properties: {
                buyer___first_name: buyerName,
                buyer___address: buyerAddress,
                dealname: dealName,
                dealstage: 'qualifiedtobuy',
                pipeline: 'default',
                sale_amount: amount.toFixed(2).toString(),
                seller___first_name: seller.properties.firstname,
                seller___address: sellerAddress,
                listing: listingUrl,
            },
        });
        const updatedContact = yield hubspotClient.crm.contacts.basicApi.update(hSBuyerId, {
            properties: {
                phone: buyerPhone,
            },
        });
        console.log('Hubspot Deal: ', apiResponse.id);
        const associateContactsToDeal = yield hubspotClient.crm.associations.batchApi.create('contact', 'deal', {
            inputs: [
                {
                    _from: { id: hSSellerId },
                    to: { id: apiResponse.id },
                    type: 'contact_to_deal',
                },
                {
                    _from: { id: updatedContact.id },
                    to: { id: apiResponse.id },
                    type: 'contact_to_deal',
                },
            ],
        });
        console.log('Hubspot Contacts: ', associateContactsToDeal.results);
        return {
            dealCreated: apiResponse,
            updatedContact: updatedContact,
            association: associateContactsToDeal.results,
        };
    }
    catch (e) {
        const error = e.message === 'HTTP request failed'
            ?
                JSON.stringify(e.response, null, 2)
            : e;
        throw new common_1.AppError(error);
    }
});
exports.addHSDeal = addHSDeal;
//# sourceMappingURL=index.js.map