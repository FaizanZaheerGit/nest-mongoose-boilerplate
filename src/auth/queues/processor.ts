import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { SendgridService } from '@src/sendgrid/sendgrid.service';
import { TwilioService } from '@src/twilio/twilio.service';
import { Job } from 'bullmq';

@Processor('auth-queue')
export class AuthProcessor extends WorkerHost {
  constructor(
    @Inject(SendgridService) private readonly sendGridService: SendgridService,
    @Inject(TwilioService) private readonly twilioService: TwilioService,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    switch (job.name) {
      case 'send-email':
        return this.sendEmail(job);
      case 'send-sms':
        return this.sendSms(job);
      default:
        console.log(`Invalid Job Name sent in Auth Processor,  NAME:  ${job?.name}`);
    }
  }

  async sendEmail(job: Job) {
    try {
      console.log(
        `SEND EMAIL Processor  =>  ID:  ${job?.id},  DATA:  ${JSON.stringify(job?.data)}`,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.sendGridService.sendEmails(job?.data);
    } catch (error) {
      console.error(`Error in send email processor:  ${error}`);
    }
  }

  async sendSms(job: Job) {
    try {
      console.log(`SEND SMS Processor  =>  ID:  ${job?.id},  DATA:  ${JSON.stringify(job?.data)}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.twilioService.sendBulkSms(job?.data);
    } catch (error) {
      console.error(`Error in send sms processor:  ${error}`);
    }
  }
}
