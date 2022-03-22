export const customCors = {
    origin: '*',
    headers: [
        'Content-Type',
        'X-Amz-Date',
        'Authorization',
        'X-Api-Key',
        'X-Amz-Security-Token',
        'X-Amz-User-Agent',
        'AuthorizedUserId',
        'CurrentuserId',
    ],
    allowCredentials: false,
};
