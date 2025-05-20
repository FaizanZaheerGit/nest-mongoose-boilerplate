import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendOtpDto } from './dto/send.otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResponseMessage } from '@src/utils/decorators/responseMessage.decorator';

@Controller('auth')
@ApiTags('Auth Module')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ResponseMessage('SUCCESS')
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return loginDto;
  }

  @ResponseMessage('SUCCESS')
  @ApiBearerAuth()
  @Get('/logout')
  logout() {
    return true;
  }

  @ResponseMessage('Reset Password E-mail Sent Successfully')
  @Post('/forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return forgotPasswordDto;
  }

  @ResponseMessage('Password Reset Successfully')
  @Patch('/reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return resetPasswordDto;
  }

  @ResponseMessage('OTP Sent Successfully')
  @ApiBearerAuth()
  @Post('/send-otp')
  sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return sendOtpDto;
  }

  @ResponseMessage('OTP Verified Successfully')
  @Patch('/verify-otp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return verifyOtpDto;
  }
}
