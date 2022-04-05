import 'source-map-support/register';
import { Context, Callback, PreTokenGenerationTriggerEvent } from 'aws-lambda';

export async function main(
    event: PreTokenGenerationTriggerEvent,
    _context: Context,
    callback: Callback
): Promise<void> {
    console.log(event.request);
    if (
        !(event.request.groupConfiguration?.groupsToOverride ?? '').includes(
            'adminUser'
        )
    ) {
        // user signing in is not an admin, don't allow them
        // to impersonate anyone!
        console.log(
            `Not part of the admin group [${event.request.groupConfiguration?.groupsToOverride}]`
        );
        return callback(null, event);
    }
    if (!event.request.clientMetadata?.impersonateUser) {
        // no user ID to impersonate sent along
        console.log(
            `Not requesting to impersonate someone [${event.request.clientMetadata?.impersonateUser}]`
        );
        return callback(null, event);
    }
    event.response = {
        claimsOverrideDetails: {
            claimsToAddOrOverride: {
                impersonating: event.request.clientMetadata.impersonateUser,
            },
        },
    };
    return callback(null, event);
}
