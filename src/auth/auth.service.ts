import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import { LoginDto } from '@auth/dto/login.dto';
import { UsersService } from '@user/users.service';
import { comparePassword, generateHash } from '@utils/bcrypt';
import { StatusEnums } from '@enums/status.enums';
import { CustomJwtService } from '@jwt/jwt.service';
import { ResetTokenRepository } from '@auth/repositories/resettoken.repository';
import { IResetTokenRepository } from '@auth/interfaces/resettokens.repository.interface';
import { OtpTokenRepository } from '@auth/repositories/otptokens.repository';
import { IOtpTokenRepository } from '@auth/interfaces/otptokens.repository.interface';
import { ForgotPasswordDto } from '@auth/dto/forgot-password.dto';
import { ResetPasswordDto } from '@auth/dto/reset-password.dto';
import { AppConfigService } from '@config/config.service';
import { EmailBodies, EmailSubjects } from '@utils/email';
import { SendOtpDto } from '@auth/dto/send-otp.dto';
import { VerifyOtpDto } from '@auth/dto/verify-otp.dto';
import { EmailEventPublisher } from '@auth/events/publishers/sendEmail.publisher';
import { SmsEventPublisher } from '@auth/events/publishers/sendSms.publisher';
import { SmsBodies } from '@utils/sms';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(CustomJwtService) private readonly jwtService: CustomJwtService,
    @Inject(ResetTokenRepository) private readonly resetTokenRepository: IResetTokenRepository,
    @Inject(OtpTokenRepository) private readonly otpTokenRepository: IOtpTokenRepository,
    @Inject(AppConfigService) private readonly appConfigService: AppConfigService,
    @Inject(EmailEventPublisher) private readonly emailEventPublisher: EmailEventPublisher,
    @Inject(SmsEventPublisher) private readonly smsEventPublisher: SmsEventPublisher,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const { email } = loginDto;
      const existingUser = await this.usersService.getUserByEmail(email);
      if (!existingUser) {
        throw new HttpException('Invalid e-mail or password', HttpStatus.BAD_REQUEST);
      }
      switch (existingUser.status) {
        case StatusEnums.INACTIVE:
        case StatusEnums.ARCHIVED:
          throw new HttpException(
            'User is not active. Please contact support',
            HttpStatus.BAD_REQUEST,
          );
        case StatusEnums.PENDING:
          throw new HttpException(
            'User is not verified. Please verify using OTP',
            HttpStatus.BAD_REQUEST,
          );
        default:
          break;
      }
      const doesPasswordMatch: boolean = await comparePassword(
        loginDto.password,
        existingUser?.password || '',
      );
      if (!doesPasswordMatch) {
        throw new HttpException('Invalid e-mail or password', HttpStatus.BAD_REQUEST);
      }
      const accessToken = this.jwtService.generateToken({ email });
      delete existingUser?.password;
      return { entity: existingUser, token: accessToken };
    } catch (error) {
      console.log(`Error in Login Service:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  logout() {
    try {
      return {};
    } catch (error) {
      console.error(`Error in Logout serivce:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    try {
      const existingUser = await this.usersService.getUserByEmail(email);
      if (!existingUser) {
        throw new HttpException('User with email not found', HttpStatus.BAD_REQUEST);
      }
      if (existingUser?.status !== StatusEnums.ACTIVE) {
        throw new HttpException('This user is not active', HttpStatus.BAD_REQUEST);
      }
      const resetToken = uuidV4();
      await this.resetTokenRepository.createToken(existingUser['_id'], resetToken);
      const link = `${this.appConfigService.FRONTEND_URL}/reset-password?id=${String(existingUser['_id'])}&token=${resetToken}`;
      console.log(`LINK:  ${link}`);
      // TODO: Work on implementing queue processors for sending emails and sms
      // void this.sendGridService.sendEmails(
      //   [existingUser['email']],
      //   EmailSubjects.FORGOT_PASSWORD,
      //   EmailBodies.FORGOT_PASSWORD(existingUser['name'], link),
      //   EmailBodies.FORGOT_PASSWORD(existingUser['name'], link),
      // );
      this.emailEventPublisher.publishEmailEvent({
        recipients: [existingUser['email']],
        subject: EmailSubjects.FORGOT_PASSWORD,
        html: EmailBodies.FORGOT_PASSWORD(existingUser['name'], link),
        text: EmailBodies.FORGOT_PASSWORD(existingUser['name'], link),
      });

      return {};
    } catch (error) {
      console.error(`Error in Forgot Password serivce:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { userId, token, newPassword } = resetPasswordDto;
    try {
      const existingUser = await this.usersService.getUserById(userId);
      if (!existingUser) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      const existingToken = await this.resetTokenRepository.getByTokenAndUser(existingUser, token);
      if (!existingToken || existingToken?.isExpired) {
        throw new HttpException('Invalid or expired token', HttpStatus.BAD_REQUEST);
      }
      const newPasswordHash = await generateHash(newPassword);
      await Promise.all([
        this.usersService.updateUserPasswordById(String(existingUser['_id']), newPasswordHash),
        this.resetTokenRepository.updateTokensExpiryByUser(String(existingUser['_id']), true),
      ]);
      return {};
    } catch (error) {
      console.error(`Error in Reset Password serivce:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async sendOtp(sendOtpDto: SendOtpDto) {
    try {
      const { userId } = sendOtpDto;
      const existingUser = await this.usersService.getUserById(userId);
      if (!existingUser) {
        throw new HttpException('User not Found', HttpStatus.BAD_REQUEST);
      }
      if (existingUser?.status == StatusEnums.ACTIVE) {
        throw new HttpException('This user is already verified', HttpStatus.BAD_REQUEST);
      }
      const otpToken = Math.floor(100000 + Math.random() * 900000).toString();
      await Promise.all([
        this.otpTokenRepository.updateTokensExpiryByUser(userId, true),
        this.otpTokenRepository.createToken(existingUser, otpToken),
      ]);

      // TODO: Work on implementing queue processors for sending emails and sms
      this.emailEventPublisher.publishEmailEvent({
        recipients: [existingUser['email']],
        subject: EmailSubjects.SEND_OTP,
        html: EmailBodies.SEND_OTP(existingUser['name'], otpToken),
        text: EmailBodies.SEND_OTP(existingUser['name'], otpToken),
      });

      if (existingUser?.phoneNumber) {
        this.smsEventPublisher.publishSmsEvent({
          recipients: [existingUser?.phoneNumber],
          body: SmsBodies.SEND_OTP(otpToken),
        });
      }

      return {};
    } catch (error) {
      console.error(`Error in Send OTP serivce:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    try {
      const { userId, token } = verifyOtpDto;
      const existingUser = await this.usersService.getUserById(userId);
      if (!existingUser) {
        throw new HttpException('User not Found', HttpStatus.BAD_REQUEST);
      }
      if (existingUser?.status == StatusEnums.ACTIVE) {
        throw new HttpException('This user is already verified', HttpStatus.BAD_REQUEST);
      }
      const existingOtp = await this.otpTokenRepository.getByTokenAndUser(existingUser, token);
      if (!existingOtp || existingOtp?.isExpired) {
        throw new HttpException('Invalid or Expired Token', 400);
      }
      await Promise.all([
        this.usersService.updateUserStatus(userId, StatusEnums.ACTIVE),
        this.otpTokenRepository.updateTokensExpiryByUser(userId, true),
      ]);

      // TODO: Work on implementing queue processors for sending emails and sms
      this.emailEventPublisher.publishEmailEvent({
        recipients: [existingUser['email']],
        subject: EmailSubjects.VERIFY_OTP,
        html: EmailBodies.VERIFY_OTP(existingUser['name']),
        text: EmailBodies.VERIFY_OTP(existingUser['name']),
      });

      return {};
    } catch (error) {
      console.error(`Error in Verify OTP serivce:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
