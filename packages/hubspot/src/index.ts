import * as hubspot from '@hubspot/api-client';
import { ApiException } from '@hubspot/api-client/lib/codegen/communication_preferences';
import { AppError } from '@medii/common';
import axios from 'axios';

const hubspotClient = new hubspot.Client({ apiKey: process.env.HAPIKEY });
export const addHSCompany = async (
    businessName: string,
    businessPhoneNumber: string,
    connectHSContacts: string[]
): Promise<string> => {
    try {
        const apiResponse = await hubspotClient.crm.companies.basicApi.create({
            properties: {
                name: businessName,
                phone: businessPhoneNumber,
            },
        });

        console.log('Hubspot Company: ', apiResponse.id);
        await Promise.all(
            connectHSContacts.map(async (contactId) => {
                await associateContactWithCompany(contactId, apiResponse.id);
            })
        );

        return apiResponse.id;
    } catch (e) {
        // @ts-ignore
        const error = // @ts-ignore
            e.message === 'HTTP request failed' // @ts-ignore
                ? JSON.stringify(e.response, null, 2)
                : e;
        if (
            // @ts-ignore
            e.response?.body?.message?.startsWith(
                'Company already exists. Existing ID: '
            )
        ) {
            try {
                // @ts-ignore
                const companyId = e.response?.body?.message?.replace(
                    'Company already exists. Existing ID: ',
                    ''
                );
                // S.Y. Technically could return the id, but best to make sure it can be retrieved and validate the emails match.
                const apiResponse =
                    await hubspotClient.crm.companies.basicApi.getById(
                        companyId
                    );
                console.log('Hubspot Company: ', apiResponse.id);
                return apiResponse.id;
            } catch (e) {
                const error = // @ts-ignore
                    e.message === 'HTTP request failed' // @ts-ignore
                        ? JSON.stringify(e.response, null, 2)
                        : e;
                console.error(error);
                // @ts-ignore
                throw new AppError(error);
            }
        } else {
            // @ts-ignore
            throw new AppError(error);
        }
    }
};

export const associateContactWithCompany = async (
    contactId: string,
    companyId: string
) => {
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

        const apiResponse =
            await hubspotClient.crm.associations.batchApi.create(
                fromObjectType,
                toObjectType,
                BatchInputPublicAssociation
            );

        console.log('Associated Company: ', apiResponse.results);

        return apiResponse.results;
    } catch (e) {
        const error =
            // @ts-ignore
            e.message === 'HTTP request failed'
                ? // @ts-ignore
                  JSON.stringify(e.response, null, 2)
                : e;
        // @ts-ignore
        throw new AppError(error);
    }
};

export const addHSContact = async (
    emailAddress: string,
    firstName: string
): Promise<string> => {
    try {
        const apiResponse = await hubspotClient.crm.contacts.basicApi.create({
            properties: {
                email: emailAddress,
                firstname: firstName,
            },
        });
        console.log('Hubspot Contact: ', apiResponse.id);
        return apiResponse.id;
    } catch (e) {
        const error =
            // @ts-ignore
            e.message === 'HTTP request failed'
                ? // @ts-ignore
                  JSON.stringify(e.response, null, 2)
                : e;
        if (
            // @ts-ignore
            e.response?.body?.message?.startsWith(
                'Contact already exists. Existing ID: '
            )
        ) {
            try {
                // @ts-ignore
                const contactId = e.response?.body?.message?.replace(
                    'Contact already exists. Existing ID: ',
                    ''
                );
                // S.Y. Technically could return the id, but best to make sure it can be retrieved and validate the emails match.
                const apiResponse =
                    await hubspotClient.crm.contacts.basicApi.getById(
                        contactId
                    );
                console.log('Hubspot Contact: ', apiResponse.id);
                return apiResponse.id;
            } catch (e) {
                const error =
                    // @ts-ignore
                    e.message === 'HTTP request failed'
                        ? // @ts-ignore
                          JSON.stringify(e.response, null, 2)
                        : e;
                console.error(error);
                // @ts-ignore
                throw new AppError(error);
            }
        } else {
            // @ts-ignore
            throw new AppError(error);
        }
    }
};

export const updateHSContact = async (
    HsId: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
): Promise<string> => {
    try {
        const apiResponse = await hubspotClient.crm.contacts.basicApi.update(
            HsId,
            {
                properties: {
                    firstname: firstName,
                    lastname: lastName,
                    phone: phoneNumber,
                },
            }
        );
        console.log('Hubspot Contact Updated: ', apiResponse.id);
        return apiResponse.id;
    } catch (e) {
        const error =
            // @ts-ignore
            e.message === 'HTTP request failed'
                ? // @ts-ignore
                  JSON.stringify(e.response, null, 2)
                : e;
        // @ts-ignore
        throw new AppError(error);
    }
};

function convertTZ(date, tzString) {
    return new Date(
        (typeof date === 'string' ? new Date(date) : date).toLocaleString(
            'en-US',
            {
                timeZone: tzString,
            }
        )
    );
}

export const addHSTask = async (taskBody: string, taskHeader: string) => {
    try {
        let dueDate = getHSDueDate(new Date());
        const task = await axios.post(
            `https://api.hubapi.com/crm/v3/objects/tasks?hapikey=${process.env.HAPIKEY}`,
            {
                properties: {
                    hs_timestamp: dueDate.toISOString(),
                    hs_task_body: taskBody,
                    hs_task_subject: taskHeader,
                    hs_task_status: 'WAITING',
                    hs_task_priority: 'HIGH',
                    hs_task_type: 'TODO',
                },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('TASK: ', task.data);
        return task.data;
    } catch (e) {
        const error =
            // @ts-ignore
            e.message === 'HTTP request failed'
                ? // @ts-ignore
                  JSON.stringify(e.response, null, 2)
                : e;
        // @ts-ignore
        throw new AppError(error);
    }
};

export const getHSDueDate = (dateIssued) => {
    let nowAEST = convertTZ(dateIssued, 'Australia/Sydney');
    const isWeekend = nowAEST.getDay() % 6 === 0;
    const isFridayAfternoon =
        nowAEST.getDay() % 6 === 5 && nowAEST.getHours() >= 16;
    const isMondayMorning =
        nowAEST.getDay() % 6 === 1 && nowAEST.getHours() < 9;
    const isWorkHours = nowAEST.getHours() >= 9 && nowAEST.getHours() < 16;
    const anHour = 1000 * 60 * 60; // an hour
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
        } else {
            if (nowAEST.getHours() >= 16) {
                dueDate.setDate(dueDate.getDate() + 1);
            }
        }
        dueDate.setHours(10);
        dueDate.setMinutes(0);
        dueDate.setSeconds(0);
        dueDate.setMilliseconds(0);
    } else {
        dueDate = new Date(nowAEST.getTime() + anHour);
    }
    return dueDate;
};

export const associateContactWithTask = async (
    contactId: number,
    taskId: number
) => {
    try {
        const association = await axios.put(
            `https://api.hubapi.com/crm/v3/objects/tasks/${taskId}/associations/contacts/${contactId}/204?hapikey=${process.env.HAPIKEY}`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('ASSOCIATION: ', association.data);
        return association.data;
    } catch (e) {
        const error =
            // @ts-ignore
            e.message === 'HTTP request failed'
                ? // @ts-ignore
                  JSON.stringify(e.response, null, 2)
                : e;
        // @ts-ignore
        throw new AppError(error);
    }
};

export const addReportTicket = async (
    accountId: number,
    listingId: number,
    productId: number
): Promise<any> => {
    const properties = {
        hs_pipeline: '0',
        hs_pipeline_stage: '1',
        hs_ticket_priority: 'HIGH',
        subject: 'troubleshoot report',
        content:
            'For Listing ' +
            listingId.toString() +
            ' On Page ' +
            `https://www.lasersharks.click/product/${productId}/listing/${listingId}`,
    };
    const SimplePublicObjectInput = { properties };

    try {
        const apiResponse = await hubspotClient.crm.tickets.basicApi.create(
            SimplePublicObjectInput
        );

        const ticketId = apiResponse.id;
        const toObjectType = 'contact';
        const toObjectId = accountId.toString();
        const associationType = 'ticket_to_contact';

        try {
            const finalResponse =
                await hubspotClient.crm.tickets.associationsApi.create(
                    ticketId,
                    toObjectType,
                    toObjectId,
                    associationType
                );
            console.log(JSON.stringify(apiResponse, null, 2));
            return finalResponse;
        } catch (e) {
            // @ts-ignore
            e.message === 'HTTP request failed'
                ? // @ts-ignore
                  console.error(JSON.stringify(e.response, null, 2))
                : console.error(e);
            // @ts-ignore
            throw new AppError(e);
        }
    } catch (e) {
        // @ts-ignore
        e.message === 'HTTP request failed'
            ? // @ts-ignore
              console.error(JSON.stringify(e.response, null, 2))
            : console.error(e);
        // @ts-ignore
        throw new AppError(e);
    }
};
export const addQuestionReportTicket = async (
    accountId: number,
    questionId: number
): Promise<any> => {
    console.log(
        `HUBSPOT| addQuestionReportTicket - Question Id [${questionId}]`
    );
    const properties = {
        hs_pipeline: '0',
        hs_pipeline_stage: '1',
        hs_ticket_priority: 'HIGH',
        subject: 'question troubleshoot report',
        content: 'For Question ' + questionId.toString(),
    };
    const SimplePublicObjectInput = { properties };

    try {
        const apiResponse = await hubspotClient.crm.tickets.basicApi.create(
            SimplePublicObjectInput
        );

        const ticketId = apiResponse.id;
        const toObjectType = 'contact';
        const toObjectId = accountId.toString();
        const associationType = 'ticket_to_contact';

        try {
            const finalResponse =
                await hubspotClient.crm.tickets.associationsApi.create(
                    ticketId,
                    toObjectType,
                    toObjectId,
                    associationType
                );
            console.log(JSON.stringify(apiResponse, null, 2));
            return finalResponse;
        } catch (e) {
            // @ts-ignore
            e.message === 'HTTP request failed'
                ? // @ts-ignore
                  console.error(JSON.stringify(e.response, null, 2))
                : console.error(e);
            // @ts-ignore
            throw new AppError(e);
        }
    } catch (e) {
        // @ts-ignore
        e.message === 'HTTP request failed'
            ? // @ts-ignore
              console.error(JSON.stringify(e.response, null, 2))
            : console.error(e);
        // @ts-ignore
        throw new AppError(e);
    }
};

export const getHSDeal = async (dealId: string) => {
    try {
        const properties = undefined;
        const propertiesWithHistory = undefined;
        const associations = undefined;
        const archived = false;
        const idProperty = undefined;
        const deal = await hubspotClient.crm.deals.basicApi.getById(
            dealId,
            properties,
            propertiesWithHistory,
            associations,
            archived,
            idProperty
        );

        return deal;
    } catch (e) {
        const error =
            // @ts-ignore
            e.message === 'HTTP request failed'
                ? // @ts-ignore
                  JSON.stringify(e.response, null, 2)
                : e;
        // @ts-ignore
        throw new AppError(error);
    }
};

export const addHSDeal = async (
    hSBuyerId: string,
    buyerName: string,
    buyerPhone: string,
    buyerAddress: string,
    hSSellerId: string,
    sellerAddress: string,
    amount: number,
    dealName: string,
    listingUrl: string
) => {
    try {
        const seller = await hubspotClient.crm.contacts.basicApi.getById(
            hSSellerId,
            ['firstname']
        );

        const apiResponse = await hubspotClient.crm.deals.basicApi.create({
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

        const updatedContact = await hubspotClient.crm.contacts.basicApi.update(
            hSBuyerId,
            {
                properties: {
                    phone: buyerPhone,
                },
            }
        );

        console.log('Hubspot Deal: ', apiResponse.id);
        const associateContactsToDeal =
            await hubspotClient.crm.associations.batchApi.create(
                'contact',
                'deal',
                {
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
                }
            );
        console.log('Hubspot Contacts: ', associateContactsToDeal.results);

        return {
            dealCreated: apiResponse,
            updatedContact: updatedContact,
            association: associateContactsToDeal.results,
        };
    } catch (e) {
        const error =
            // @ts-ignore
            e.message === 'HTTP request failed'
                ? // @ts-ignore
                  JSON.stringify(e.response, null, 2)
                : e;
        // @ts-ignore
        throw new AppError(error);
    }
};
