import {
    EventSubscriber,
    EntitySubscriberInterface,
    UpdateEvent,
    RemoveEvent,
} from 'typeorm';
import { OptimisticLockVersionMismatchError } from './OptimisticLockVersionMismatchError';

@EventSubscriber()
export class OptimisticLockingSubscriber implements EntitySubscriberInterface {
    beforeUpdate(event: UpdateEvent<any>) {
        // To know if an entity has a version number, we check if versionColumn
        // is defined in the metadatas of that entity.
        if (event.metadata.versionColumn && event.entity) {
            // Getting the current version of the requested entity update
            const versionFromUpdate = Reflect.get(
                event.entity,
                event.metadata.versionColumn.propertyName
            );

            // Getting the entity's version from the database
            const versionFromDatabase =
                event.databaseEntity[event.metadata.versionColumn.propertyName];

            // they should match otherwise someone has changed it underneath us
            if (versionFromDatabase !== versionFromUpdate) {
                throw new OptimisticLockVersionMismatchError(
                    event.metadata.tableName,
                    versionFromDatabase,
                    versionFromUpdate
                );
            }
        }
    }

    beforeRemove(event: RemoveEvent<any>) {
        // To know if an entity has a version number, we check if versionColumn
        // is defined in the metadatas of that entity.
        if (event.metadata.versionColumn && event.entity) {
            // Getting the current version of the requested entity update
            const versionFromRemove = Reflect.get(
                event.entity,
                event.metadata.versionColumn.propertyName
            );

            // Getting the entity's version from the database
            const versionFromDatabase =
                event.databaseEntity[event.metadata.versionColumn.propertyName];

            // they should match otherwise someone has changed it underneath us
            if (versionFromDatabase !== versionFromRemove) {
                throw new OptimisticLockVersionMismatchError(
                    event.metadata.tableName,
                    versionFromDatabase,
                    versionFromRemove
                );
            }
        }
    }
}
