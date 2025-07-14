/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { AppConfigService } from '@config/config.service';
import { Inject, Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendgridService {
  private sendGridFromEmail: string;
  constructor(@Inject(AppConfigService) private readonly appConfigService: AppConfigService) {
    const { SENDGRID_API_KEY, SENDGRID_FROM_EMAIL } = this.appConfigService.sendGridConfig;
    this.sendGridFromEmail = SENDGRID_FROM_EMAIL || '';
    sgMail.setApiKey(String(SENDGRID_API_KEY));
  }

  sendEmails = (payload: {
    recipients: string[];
    subject: string;
    html: string;
    text: string;
  }): Promise<boolean> => {
    const { html, recipients, subject, text } = payload;
    return sgMail
      .send({
        from: this.sendGridFromEmail,
        to: recipients,
        subject,
        text,
        html,
      })
      .then(
        (val) => {
          console.log(`EMAIL SENT SUCCESSFULLY!  =>  STATUS:  ${val[0]?.statusCode}`);
          return true;
        },
        (error) => {
          console.error(error);
          if (error?.response) {
            console.error('ERROR IN SENDING EMAIL:  =>  ' + error?.response?.body);
          }
          return false;
        },
      );
  };
}
