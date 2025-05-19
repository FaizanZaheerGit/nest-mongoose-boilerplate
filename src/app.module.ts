import { Module } from '@nestjs/common';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { UsersModule } from '@user/users.module';
import { AuthModule } from '@auth/auth.module';
import { AppConfigModule } from '@config/config.module';
import { DbProviderModule } from '@database/provider.module';
import { SendgridModule } from '@src/sendgrid/sendgrid.module';
import { TwilioModule } from '@src/twilio/twilio.module';

@Module({
  imports: [
    AppConfigModule,
    DbProviderModule,
    UsersModule,
    AuthModule,
    SendgridModule,
    TwilioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
