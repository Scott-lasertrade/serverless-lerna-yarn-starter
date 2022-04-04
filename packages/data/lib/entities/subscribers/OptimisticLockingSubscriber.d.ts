import { EntitySubscriberInterface, UpdateEvent, RemoveEvent } from 'typeorm';
export declare class OptimisticLockingSubscriber implements EntitySubscriberInterface {
    beforeUpdate(event: UpdateEvent<any>): void;
    beforeRemove(event: RemoveEvent<any>): void;
}
//# sourceMappingURL=OptimisticLockingSubscriber.d.ts.map