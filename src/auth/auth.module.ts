import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpToken, OtpTokenSchema } from './models/otptokens.model';
import { ResetToken, ResetTokenSchema } from './models/resettokens.model';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from '@config/config.service';
import { UsersModule } from '@src/users/users.module';

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
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
