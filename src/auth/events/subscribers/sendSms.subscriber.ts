import { OnEvent } from '@nestjs/event-emitter';
import { EventNames } from '@auth/events/event.names.enum';
import { Injectable, Inject } from '@nestjs/common';
import { AuthQueue } from '@auth/queues/queue';

@Injectable()
export class SmsEventSubcriber {
  constructor(@Inject(AuthQueue) private readonly authQueue: AuthQueue) {}

  @OnEvent(EventNames.SEND_SMS)
  sendEmailSubcriber(payload: { recipients: string[]; body: string }) {
    console.log(`PAYLOAD INSIDE SMS SUBSCRIBER:  ${JSON.stringify(payload)}`);
    void this.authQueue.addSendSmsJob(payload);
  }
}
