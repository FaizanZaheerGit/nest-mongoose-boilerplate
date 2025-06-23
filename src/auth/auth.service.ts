import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LoginDto } from '@auth/dto/login.dto';
import { UsersService } from '@user/users.service';
import { comparePassword } from '@utils/bcrypt';
import { StatusEnums } from '@enums/status.enums';
import { CustomJwtService } from '@jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(CustomJwtService) private readonly jwtService: CustomJwtService,
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
}
