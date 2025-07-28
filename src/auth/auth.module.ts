import { Module } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { AuthController } from '@auth/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpToken, OtpTokenSchema } from '@auth/models/otptokens.model';
import { ResetToken, ResetTokenSchema } from '@auth/models/resettokens.model';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from '@config/config.service';
import { UsersModule } from '@user/users.module';
import { JwtStrategy } from '@jwt/jwt.strategy';
import { CustomJwtService } from '@jwt/jwt.service';
import { ResetTokenRepository } from './repositories/resettoken.repository';
import { OtpTokenRepository } from './repositories/otptokens.repository';
import { EmailEventPublisher } from '@auth/events/publishers/sendEmail.publisher';
import { SmsEventPublisher } from '@auth/events/publishers/sendSms.publisher';
import { EmailEventSubcriber } from '@auth/events/subscribers/sendEmail.subscriber';
import { SmsEventSubcriber } from '@auth/events/subscribers/sendSms.subscriber';
import { BullModule } from '@nestjs/bullmq';
import { AuthQueue } from '@auth/queues/queue';
import { AuthProcessor } from '@auth/queues/processor';

// TODO: Try Lazy Loading Modules to see how it affects performance and start up time
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (appConfigService: AppConfigService) => ({
        jwtSecret: appConfigService.JWT_SECRET,
        signOptions: { expiresIn: appConfigService.JWT_EXPIRY },
      }),
      inject: [AppConfigService],
    }),
    MongooseModule.forFeature([
      { name: OtpToken.name, schema: OtpTokenSchema },
      { name: ResetToken.name, schema: ResetTokenSchema },
    ]),
    BullModule.registerQueue({
      name: 'auth-queue',
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    CustomJwtService,
    ResetTokenRepository,
    OtpTokenRepository,
    EmailEventPublisher,
    SmsEventPublisher,
    EmailEventSubcriber,
    SmsEventSubcriber,
    AuthQueue,
    AuthProcessor,
  ],
  exports: [AuthService],
})
export class AuthModule {}
