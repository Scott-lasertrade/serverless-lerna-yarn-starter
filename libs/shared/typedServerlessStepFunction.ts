// import type { AWS } from '@serverless/typescript';
// type Definition = {
//     Comment?: string;
//     StartAt: string;
//     States: {
//         [state: string]: {
//             Catch?: Catcher[];
//             Choices?: Choice[];
//             Type:
//                 | 'Choice'
//                 | 'Fail'
//                 | 'Map'
//                 | 'Task'
//                 | 'Parallel'
//                 | 'Pass'
//                 | 'Wait';
//             End?: boolean;
//             Next?: string;
//             Seconds?: number;
//             TimestampPath?: string;
//             ItemsPath?: string;
//             ResultPath?: string;
//             Resource?: string | { 'Fn::GetAtt': string[] };
//             Iterator?: Definition;
//         };
//     };
// };

// type Choice = {
//     Variable: string;
//     StringEquals: string;
//     Next: string;
// };

// type Catcher = {
//     ErrorEquals: ErrorName[];
//     Next: string;
//     ResultPath?: string;
// };

// type Event = {
//     [http: string]: {
//         path: string;
//         method: 'POST' | 'GET' | 'PUT';
//         authorizer?: 'aws_iam' | 'cognito';
//         cors?: boolean;
//     };
// };

// type ErrorName =
//     | 'States.ALL'
//     | 'States.DataLimitExceeded'
//     | 'States.Runtime'
//     | 'States.Timeout'
//     | 'States.TaskFailed'
//     | 'States.Permissions'
//     | string;

// export interface StateMachine {
//     stateMachines: {
//         [stateMachine: string]: {
//             name: string;
//             events?: Event;
//             definition: Definition;
//         };
//     };
//     activities?: string[];
//     validate?: boolean;
// }

// export default interface ServerlessWithStepFunctions extends AWS {
//     stepFunctions?: StateMachine;
// }
