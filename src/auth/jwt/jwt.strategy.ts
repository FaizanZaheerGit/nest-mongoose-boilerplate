import { AppConfigService } from '@config/config.service';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '@user/users.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly appConfigService: AppConfigService,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.JWT_SECRET || '', // NOTE: pipe condition added here to avoid TS errors
    });
  }

  async validate(payload: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!payload.email) {
      throw new HttpException(`Invalid or expired token`, HttpStatus.UNAUTHORIZED);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const existingUser = await this.usersService.getUserByEmail(payload.email);
    if (!existingUser) {
      throw new HttpException('Unauthorized Access', HttpStatus.UNAUTHORIZED);
    }
    return {
      _id: existingUser['_id'],
      email: existingUser['email'],
      name: existingUser['name'],
      roles: existingUser['roles'],
      userType: existingUser['userType'],
    };
  }
}
