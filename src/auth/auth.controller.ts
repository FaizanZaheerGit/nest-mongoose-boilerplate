import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '@auth/dto/login.dto';
import { ForgotPasswordDto } from '@auth/dto/forgot-password.dto';
import { ResetPasswordDto } from '@auth/dto/reset-password.dto';
import { SendOtpDto } from '@auth/dto/send-otp.dto';
import { VerifyOtpDto } from '@auth/dto/verify-otp.dto';
import { ResponseMessage } from '@src/utils/decorators/responseMessage.decorator';
import { JwtAuthGuard } from '@auth/guards/auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
@ApiTags('Auth Module')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ResponseMessage('SUCCESS')
  @Throttle({ default: { limit: 15, ttl: 60 } })
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @ResponseMessage('SUCCESS')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  logout() {
    return this.authService.logout();
  }

  @ResponseMessage('Reset Password E-mail Sent Successfully')
  @Throttle({ default: { limit: 15, ttl: 60 } })
  @Post('/forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @ResponseMessage('Password Reset Successfully')
  @Throttle({ default: { limit: 15, ttl: 60 } })
  @Patch('/reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @ResponseMessage('OTP Sent Successfully')
  @ApiBearerAuth()
  @Post('/send-otp')
  sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto);
  }

  @ResponseMessage('OTP Verified Successfully')
  @Throttle({ default: { limit: 15, ttl: 60 } })
  @Patch('/verify-otp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  // NOTE: Work on accessToken and refreshToken functionality
  // @ResponseMessage('SUCCESS')
  // @Get('/tokens/refresh')
  // refreshToken() {
  //   return true;
  // }
}
