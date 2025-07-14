import { OnEvent } from '@nestjs/event-emitter';
import { EventNames } from '@auth/events/event.names.enum';
import { Injectable, Inject } from '@nestjs/common';
import { SendgridService } from '@src/sendgrid/sendgrid.service';

@Injectable()
export class EmailEventSubcriber {
  constructor(@Inject(SendgridService) private readonly sendGridService: SendgridService) {}

  @OnEvent(EventNames.SEND_EMAIL)
  sendEmailSubcriber(payload: {
    recipients: string[];
    subject: string;
    html: string;
    text: string;
  }) {
    console.log(`PAYLOAD INSIDE EMAIL SUBSCRIBER:  ${JSON.stringify(payload)}`);
    void this.sendGridService.sendEmails(payload);
  }
}
