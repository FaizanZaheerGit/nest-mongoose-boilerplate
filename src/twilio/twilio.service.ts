/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { AppConfigService } from '@config/config.service';
import { Inject, Injectable } from '@nestjs/common';
import * as twilio from 'twilio';

@Injectable()
export class TwilioService {
  private twilioClient: twilio.Twilio;
  constructor(@Inject(AppConfigService) private readonly appConfigService: AppConfigService) {
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = this.appConfigService.twilioConfig;
    this.twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }

  sendBulkSms = async (recipients: string[], body: string): Promise<boolean> => {
    try {
      const sendPromises = recipients.map((to) =>
        this.twilioClient.messages
          .create({
            from: this.appConfigService.TWILIO_FROM_NUMBER,
            to,
            body,
          })
          .then((res) => {
            console.log(`SMS sent to ${to} | SID: ${res.sid}`);
            return true;
          })
          .catch((err) => {
            console.error(`Failed to send SMS to ${to} | Error: ${err.message}`);
            return false;
          }),
      );

      const results = await Promise.all(sendPromises);
      const successCount = results.filter((r) => r).length;

      console.log(`${successCount}/${recipients.length} SMS messages sent successfully.`);
      return successCount === recipients.length;
    } catch (error) {
      console.error(`Unexpected error in sendBulkSms: ${error}`);
      return false;
    }
  };
}
