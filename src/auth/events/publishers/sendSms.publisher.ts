import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventNames } from '../event.names.enum';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class SmsEventPublisher {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(SmsEventPublisher.name);
  }

  publishSmsEvent(payload: { recipients: string[]; body: string }) {
    this.logger.info(`'send-sms' Event Published with Payload  =>  ${JSON.stringify(payload)}`);
    this.eventEmitter.emit(EventNames.SEND_SMS, payload);
  }
}
