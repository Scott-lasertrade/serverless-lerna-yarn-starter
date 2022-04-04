import {
    SFNClient,
    SFNClientConfig,
    StartExecutionCommand,
    StartExecutionCommandInput,
} from '@aws-sdk/client-sfn';

export const startStateMachine = async (
    stateMachineARN: string,
    offlineStateMachineARN: string,
    data: any,
    offlineMode: boolean = false
) => {
    let config: SFNClientConfig = { region: 'ap-southeast-2' };
    let params: StartExecutionCommandInput;
    let currentStateMachine: string = stateMachineARN;

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

    const client = new SFNClient(config);
    console.log('State Machine|Initiating...');
    try {
        const command = new StartExecutionCommand(params);
        await client.send(command);
        console.log('State Machine|Initiated');
    } catch (err) {
        console.log('State Machine|Failed to Initiate', err);
    }
};
