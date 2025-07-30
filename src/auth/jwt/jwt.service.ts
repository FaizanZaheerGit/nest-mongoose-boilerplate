import { AppConfigService } from '@config/config.service';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { PinoLogger } from 'nestjs-pino';

// TODO: Add Refresh Token functionality here
@Injectable()
export class CustomJwtService {
  constructor(
    @Inject(AppConfigService) private readonly appConfigService: AppConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CustomJwtService.name);
  }

  generateToken(payload: { email: string }) {
    const jwtExpiry: any = this.appConfigService.JWT_EXPIRY ?? '1d';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return jwt.sign(payload, String(this.appConfigService.JWT_SECRET), { expiresIn: jwtExpiry });
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, String(this.appConfigService.JWT_SECRET));
    } catch (error) {
      this.logger.info(`Error in verifyToken Jwt Service:  ${error}`);
      throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
    }
  }
}
