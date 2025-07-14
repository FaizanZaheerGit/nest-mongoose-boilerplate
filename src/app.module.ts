import { Module } from '@nestjs/common';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { UsersModule } from '@user/users.module';
import { AuthModule } from '@auth/auth.module';
import { AppConfigModule } from '@config/config.module';
import { DbProviderModule } from '@database/provider.module';
import { SendgridModule } from '@src/sendgrid/sendgrid.module';
import { TwilioModule } from '@src/twilio/twilio.module';
import { RolesModule } from '@role/roles.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot({ global: true }),
    AppConfigModule,
    AuthModule,
    DbProviderModule,
    RolesModule,
    SendgridModule,
    TwilioModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
