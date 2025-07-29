import { Global, Module } from '@nestjs/common';
import { SendgridService } from '@src/sendgrid/sendgrid.service';

// TODO: Replace Send Grid Module with Generic Mailer Module to send e-mail from any SMTP

@Global()
@Module({
  imports: [],
  providers: [SendgridService],
  exports: [SendgridService],
})
export class SendgridModule {}
