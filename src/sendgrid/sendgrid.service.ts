/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { AppConfigService } from '@config/config.service';
import { Inject, Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { PinoLogger } from 'nestjs-pino';

// TODO: Replace Send Grid Servie with Generic Mailer Service to send e-mail from any SMTP

@Injectable()
export class SendgridService {
  private sendGridFromEmail: string;
  constructor(
    @Inject(AppConfigService) private readonly appConfigService: AppConfigService,
    private readonly logger: PinoLogger,
  ) {
    const { SENDGRID_API_KEY, SENDGRID_FROM_EMAIL } = this.appConfigService.sendGridConfig;
    this.sendGridFromEmail = SENDGRID_FROM_EMAIL || '';
    sgMail.setApiKey(String(SENDGRID_API_KEY));
    this.logger.setContext(SendgridService.name);
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
          this.logger.info(`EMAIL SENT SUCCESSFULLY!  =>  STATUS:  ${val[0]?.statusCode}`);
          return true;
        },
        (error) => {
          this.logger.error(error);
          if (error?.response) {
            this.logger.error('ERROR IN SENDING EMAIL:  =>  ' + error?.response?.body);
          }
          return false;
        },
      );
  };
}
