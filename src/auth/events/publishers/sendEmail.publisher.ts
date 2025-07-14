import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventNames } from '../event.names.enum';

@Injectable()
export class EmailEventPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  publishEmailEvent(payload: {
    recipients: string[];
    subject: string;
    html: string;
    text: string;
  }) {
    console.log(`'send-email' Event Published with Payload  =>  ${JSON.stringify(payload)}`);
    this.eventEmitter.emit(EventNames.SEND_EMAIL, payload);
  }
}
