import { OnEvent } from '@nestjs/event-emitter';
import { EventNames } from '@auth/events/event.names.enum';
import { Injectable, Inject } from '@nestjs/common';
import { TwilioService } from '@src/twilio/twilio.service';

@Injectable()
export class SmsEventSubcriber {
  constructor(@Inject(TwilioService) private readonly twilioService: TwilioService) {}

  @OnEvent(EventNames.SEND_SMS)
  sendEmailSubcriber(payload: { recipients: string[]; body: string }) {
    console.log(`PAYLOAD INSIDE SMS SUBSCRIBER:  ${JSON.stringify(payload)}`);
    void this.twilioService.sendBulkSms(payload);
  }
}
