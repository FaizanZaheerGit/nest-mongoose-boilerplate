import { Global, Module } from '@nestjs/common';
import { MailService } from '@src/mail/mailer.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppConfigService } from '@config/config.service';

// TODO: Replace Send Grid Module with Generic Mailer Module to send e-mail from any SMTP

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        transport: {
          host: config.SMTP_HOST,
          port: config.SMTP_PORT,
          auth: {
            user: config.SMTP_USER,
            pass: config.SMTP_PASSWORD,
          },
        },
        defaults: {
          from: `${config.SMTP_FROM_EMAIL}`,
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
