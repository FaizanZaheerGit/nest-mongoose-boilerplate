import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventNames } from '../event.names.enum';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class EmailEventPublisher {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(EmailEventPublisher.name);
  }

  publishEmailEvent(payload: {
    recipients: string[];
    subject: string;
    html: string;
    text: string;
  }) {
    this.logger.info(`'send-email' Event Published with Payload  =>  ${JSON.stringify(payload)}`);
    this.eventEmitter.emit(EventNames.SEND_EMAIL, payload);
  }
}
