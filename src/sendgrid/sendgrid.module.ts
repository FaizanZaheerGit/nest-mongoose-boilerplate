import { Global, Module } from '@nestjs/common';
import { SendgridService } from '@src/sendgrid/sendgrid.service';

@Global()
@Module({
  imports: [],
  providers: [SendgridService],
  exports: [SendgridService],
})
export class SendgridModule {}
