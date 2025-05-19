import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendOtpDto } from './dto/send.otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
@ApiTags('Auth Module')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return loginDto;
  }

  @Get('/logout')
  @ApiBearerAuth()
  logout() {
    return true;
  }

  @Post('/forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return forgotPasswordDto;
  }

  @Patch('/reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return resetPasswordDto;
  }

  @Post('/send-otp')
  sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return sendOtpDto;
  }

  @Patch('/verify-otp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return verifyOtpDto;
  }
}
