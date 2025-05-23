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
  providers: [AuthService, JwtStrategy, CustomJwtService],
  exports: [AuthService],
})
export class AuthModule {}
