import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { MailService } from '@src/mail/mailer.service';
import { TwilioService } from '@src/twilio/twilio.service';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';

@Processor('auth-queue')
export class AuthProcessor extends WorkerHost {
  constructor(
    @Inject(MailService) private readonly mailService: MailService,
    @Inject(TwilioService) private readonly twilioService: TwilioService,
    private readonly logger: PinoLogger,
  ) {
    super();
    this.logger.setContext(AuthProcessor.name);
  }

  async process(job: Job): Promise<any> {
    switch (job.name) {
      case 'send-email':
        return this.sendEmail(job);
      case 'send-sms':
        return this.sendSms(job);
      default:
        this.logger.info(`Invalid Job Name sent in Auth Processor,  NAME:  ${job?.name}`);
    }
  }

  async sendEmail(job: Job) {
    try {
      this.logger.info(
        `SEND EMAIL Processor  =>  ID:  ${job?.id},  DATA:  ${JSON.stringify(job?.data)}`,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.mailService.sendEmails(job?.data);
    } catch (error) {
      this.logger.error(`Error in send email processor:  ${error}`);
    }
  }

  async sendSms(job: Job) {
    try {
      this.logger.info(
        `SEND SMS Processor  =>  ID:  ${job?.id},  DATA:  ${JSON.stringify(job?.data)}`,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.twilioService.sendBulkSms(job?.data);
    } catch (error) {
      this.logger.error(`Error in send sms processor:  ${error}`);
    }
  }
}
