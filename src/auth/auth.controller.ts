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
import { SendOtpDto } from '@auth/dto/send.otp.dto';
import { VerifyOtpDto } from '@auth/dto/verify-otp.dto';
import { ResponseMessage } from '@src/utils/decorators/responseMessage.decorator';
import { JwtAuthGuard } from '@auth/guards/auth.guard';

@Controller('auth')
@ApiTags('Auth Module')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('SUCCESS')
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ResponseMessage('SUCCESS')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  logout() {
    return this.authService.logout();
  }

  @ResponseMessage('Reset Password E-mail Sent Successfully')
  @Post('/forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @ResponseMessage('Password Reset Successfully')
  @Patch('/reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
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

  // NOTE: Work on accessToken and refreshToken functionality
  // @ResponseMessage('SUCCESS')
  // @Get('/tokens/refresh')
  // refreshToken() {
  //   return true;
  // }
}
