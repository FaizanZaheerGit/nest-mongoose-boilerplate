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
import { SendgridService } from '@src/sendgrid/sendgrid.service';
import { EmailBodies, EmailSubjects } from '@utils/email';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(CustomJwtService) private readonly jwtService: CustomJwtService,
    @Inject(ResetTokenRepository) private readonly resetTokenRepository: IResetTokenRepository,
    @Inject(OtpTokenRepository) private readonly otpTokenRepository: IOtpTokenRepository,
    @Inject(AppConfigService) private readonly appConfigService: AppConfigService,
    @Inject(SendgridService) private readonly sendGridService: SendgridService,
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
        existingUser.password,
      );
      if (!doesPasswordMatch) {
        throw new HttpException('Invalid e-mail or password', HttpStatus.BAD_REQUEST);
      }
      const accessToken = this.jwtService.generateToken({ email });
      //   const { password, ...user } = existingUser;
      // TODO: remove password from existingUser
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
      const resetToken = uuidV4();
      await this.resetTokenRepository.createToken(existingUser['_id'], resetToken);
      const link = `${this.appConfigService.FRONTEND_URL}/reset-password?id=${String(existingUser['_id'])}&token=${resetToken}`;
      console.log(`LINK:  ${link}`);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.sendGridService.sendEmails(
        [existingUser['email']],
        EmailSubjects.FORGOT_PASSWORD,
        EmailBodies.FORGOT_PASSWORD(existingUser['name'], link),
        EmailBodies.FORGOT_PASSWORD(existingUser['name'], link),
      );

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
}
