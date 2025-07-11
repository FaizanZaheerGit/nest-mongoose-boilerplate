import { EventNames } from '@enums/event.names';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class EventPublisher {
  constructor(public readonly eventEmitter2: EventEmitter2) {}

  publish(eventName: EventNames, payload: any): void {
    this.eventEmitter2.emit(eventName, payload);
  }
}
