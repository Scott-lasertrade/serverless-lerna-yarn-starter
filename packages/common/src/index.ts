export * from './shared-custom-config';
export * from './typedServerlessStepFunction';
export * from './UserpoolTriggers';

export class AppError extends Error {
    statusCode: number;
    constructor(message: string = '', statusCode: number = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}
