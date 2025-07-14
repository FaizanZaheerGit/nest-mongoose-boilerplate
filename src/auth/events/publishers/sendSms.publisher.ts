import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventNames } from '../event.names.enum';

@Injectable()
export class SmsEventPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  publishSmsEvent(payload: { recipients: string[]; body: string }) {
    console.log(`'send-sms' Event Published with Payload  =>  ${JSON.stringify(payload)}`);
    this.eventEmitter.emit(EventNames.SEND_SMS, payload);
  }
}
