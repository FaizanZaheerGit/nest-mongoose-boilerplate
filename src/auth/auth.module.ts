import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpToken, OtpTokenSchema } from './models/otptokens.model';
import { ResetToken, ResetTokenSchema } from './models/resettokens.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OtpToken.name, schema: OtpTokenSchema },
      { name: ResetToken.name, schema: ResetTokenSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
