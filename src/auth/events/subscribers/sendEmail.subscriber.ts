import { OnEvent } from '@nestjs/event-emitter';
import { EventNames } from '@auth/events/event.names.enum';
import { Injectable, Inject } from '@nestjs/common';
import { AuthQueue } from '@auth/queues/queue';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class EmailEventSubcriber {
  constructor(
    @Inject(AuthQueue) private readonly authQueue: AuthQueue,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(EmailEventSubcriber.name);
  }

  @OnEvent(EventNames.SEND_EMAIL)
  sendEmailSubcriber(payload: {
    recipients: string[];
    subject: string;
    html: string;
    text: string;
  }) {
    this.logger.info(`PAYLOAD INSIDE EMAIL SUBSCRIBER:  ${JSON.stringify(payload)}`);
    void this.authQueue.addSendEmailJob(payload);
  }
}
