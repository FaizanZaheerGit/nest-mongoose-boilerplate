import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventNames } from '@auth/events/event.names.enum';

@Injectable()
export class AuthEventPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  publishEvent(eventName: EventNames, payload: { [key: string]: any }) {
    console.log(`'${eventName}' Event Published with Payload  =>  ${JSON.stringify(payload)}`);
    this.eventEmitter.emit(eventName, payload);
  }
}
