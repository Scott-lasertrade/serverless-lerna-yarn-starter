import {
    EventBridgeClient,
    PutEventsCommand,
} from '@aws-sdk/client-eventbridge';

export const sendToEventBridge = async (
    bridgeName: string,
    event: any,
    stage: string
) => {
    const { id, type } = event;
    let client = new EventBridgeClient({ region: 'ap-southeast-2' });

    // S.Y. - When offline we need to manually point at the point we're testing against
    if (stage === 'offline') {
        client = new EventBridgeClient({
            endpoint: 'http://127.0.0.1:4010',
            region: 'ap-southeast-2',
        });
    }

    console.log(
        `Sending event ${id} of type ${type} to the ${bridgeName} event bus on AWS EventBridge`
    );
    const params = {
        Entries: [
            {
                Detail: JSON.stringify(event),
                DetailType: type,
                EventBusName: `${bridgeName}-${stage}`,
                Source:
                    bridgeName.charAt(0).toUpperCase() + bridgeName.slice(1),
            },
        ],
    };
    try {
        console.log(`Sending event...`, params);
        const command = new PutEventsCommand(params);
        const data = await client.send(command);
        console.log(`Sent event ${id}`, data);
    } catch (err) {
        console.error('Error while sending event', err);
        return err;
    }
};
