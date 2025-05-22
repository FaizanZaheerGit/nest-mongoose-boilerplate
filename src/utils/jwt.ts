import { HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET ?? 'default_jwt_secret';

const jwtExpiry: any = process.env.JWT_EXPIRY ?? '1d';

export const generateToken = (payload: { email: string }): string => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiry });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    console.log(`Error in verifyToken jwt:  ${error}`);
    throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
  }
};
