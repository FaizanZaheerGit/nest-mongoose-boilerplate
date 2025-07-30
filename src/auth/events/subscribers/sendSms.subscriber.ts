import { OnEvent } from '@nestjs/event-emitter';
import { EventNames } from '@auth/events/event.names.enum';
import { Injectable, Inject } from '@nestjs/common';
import { AuthQueue } from '@auth/queues/queue';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class SmsEventSubcriber {
  constructor(
    @Inject(AuthQueue) private readonly authQueue: AuthQueue,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(SmsEventSubcriber.name);
  }

  @OnEvent(EventNames.SEND_SMS)
  sendEmailSubcriber(payload: { recipients: string[]; body: string }) {
    this.logger.info(`PAYLOAD INSIDE SMS SUBSCRIBER:  ${JSON.stringify(payload)}`);
    void this.authQueue.addSendSmsJob(payload);
  }
}
