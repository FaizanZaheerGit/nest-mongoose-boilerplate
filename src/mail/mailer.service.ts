/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { MailerService } from '@nestjs-modules/mailer';

// TODO: Replace Send Grid Servie with Generic Mailer Service to send e-mail from any SMTP

@Injectable()
export class MailService {
  private sendGridFromEmail: string;
  constructor(
    @Inject(MailerService) private readonly mailerService: MailerService,
    private readonly logger: PinoLogger,
  ) {
    // const { SENDGRID_API_KEY, SENDGRID_FROM_EMAIL } = this.appConfigService.sendGridConfig;
    // this.sendGridFromEmail = SENDGRID_FROM_EMAIL || '';
    this.logger.setContext(MailService.name);
  }

  sendEmails = (payload: {
    recipients: string[];
    subject: string;
    html: string;
    text: string;
  }): Promise<boolean | void> => {
    const { html, recipients, subject, text } = payload;
    return this.mailerService.sendMail({ to: recipients, subject, html, text }).then(
      (val) => {
        this.logger.info(`EMAIL SENT SUCCESSFULLY!  =>  STATUS:  ${JSON.stringify(val)}`);
      },
      (error) => {
        this.logger.error(`ERROR IN SENDING EMAIL:  =>  ${JSON.stringify(error)}`);
        return false;
      },
    );

    // return sgMail
    //   .send({
    //     from: this.sendGridFromEmail,
    //     to: recipients,
    //     subject,
    //     text,
    //     html,
    //   })
    //   .then(
    //     (val) => {
    //       this.logger.info(`EMAIL SENT SUCCESSFULLY!  =>  STATUS:  ${val[0]?.statusCode}`);
    //       return true;
    //     },
    //     (error) => {
    //       this.logger.error(error);
    //       if (error?.response) {
    //         this.logger.error('ERROR IN SENDING EMAIL:  =>  ' + error?.response?.body);
    //       }
    //       return false;
    //     },
    //   );
  };
}
