import { Transform } from 'class-transformer';
import { IsDefined, IsEmail, IsString } from 'class-validator';

export class ConfigValidation {
  @Transform(({ value }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return parseInt(value, 10);
  })
  // @IsNumberString(
  //   { no_symbols: true },
  //   { message: 'PORT should be a valid number without decimals' },
  // )
  @IsDefined({ message: 'PORT is not defined in .env' })
  PORT: number;

  @IsString({})
  @IsDefined({ message: 'NODE_ENV is not defined in .env' })
  NODE_ENV: string;

  @IsString({})
  @IsDefined({ message: 'MONGODB_URI is not defined in .env' })
  MONGODB_URI: string;

  @IsString({})
  @IsDefined({ message: 'FRONTEND_URL is not defined in .env' })
  FRONTEND_URL: string;

  @IsString({})
  @IsDefined({ message: 'JWT_SECRET is not defined in .env' })
  JWT_SECRET: string;

  @IsString({})
  @IsDefined({ message: 'JWT_EXPIRY is not defined in .env' })
  JWT_EXPIRY: string;

  @Transform(({ value }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return parseInt(value, 10);
  })
  // @IsNumberString(
  //   { no_symbols: true },
  //   { message: 'SALT_WORK_FACTOR should be a valid number without decimals' },
  // )
  @IsDefined({ message: 'SALT_WORK_FACTOR is not defined in .env' })
  SALT_WORK_FACTOR: number;

  @IsString({})
  @IsDefined({ message: 'ADMIN_NAME is not defined in .env' })
  ADMIN_NAME: string;

  @IsEmail({}, { message: 'ADMIN_EMAIL must be valid email' })
  @IsString({})
  @IsDefined({ message: 'ADMIN_EMAIL is not defined in .env' })
  ADMIN_EMAIL: string;

  @IsString({})
  @IsDefined({ message: 'ADMIN_PASSWORD is not defined in .env' })
  ADMIN_PASSWORD: string;

  // @IsString({})
  // @IsDefined({ message: 'SENDGRID_API_KEY is not defined in .env' })
  // SENDGRID_API_KEY: string;

  // @IsString({})
  // @IsDefined({ message: 'SENDGRID_FROM_EMAIL is not defined in .env' })
  // SENDGRID_FROM_EMAIL: string;

  @IsString({})
  @IsDefined({ message: 'SMTP_HOST is not defined in .env' })
  SMTP_HOST: string;

  @Transform(({ value }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return parseInt(value, 10);
  })
  @IsDefined({ message: 'SMTP_PORT is not defined in .env' })
  SMTP_PORT: number;

  @IsString({})
  @IsDefined({ message: 'SMTP_USER is not defined in .env' })
  SMTP_USER: string;

  @IsString({})
  @IsDefined({ message: 'SMTP_PASSWORD is not defined in .env' })
  SMTP_PASSWORD: string;

  @IsEmail({}, { message: 'SMTP_FROM_EMAIL is not a valid e-mail' })
  @IsString({})
  @IsDefined({ message: 'SMTP_HOST is not defined in .env' })
  SMTP_FROM_EMAIL: string;

  @IsString({})
  @IsDefined({ message: 'TWILIO_ACCOUNT_SID is not defined in .env' })
  TWILIO_ACCOUNT_SID: string;

  @IsString({})
  @IsDefined({ message: 'TWILIO_AUTH_TOKEN is not defined in .env' })
  TWILIO_AUTH_TOKEN: string;

  @IsString({})
  @IsDefined({ message: 'TWILIO_FROM_NUMBER is not defined in .env' })
  TWILIO_FROM_NUMBER: string;

  @IsString({})
  @IsDefined({ message: 'REDIS_HOST is not defined in .env' })
  REDIS_HOST: string;

  @Transform(({ value }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return parseInt(value, 10);
  })
  @IsDefined({ message: 'REDIS_PORT is not defined in .env' })
  REDIS_PORT: number;

  @IsString({})
  @IsDefined({ message: 'REDIS_USERNAME is not defined in .env' })
  REDIS_USERNAME: string;

  @IsString({})
  @IsDefined({ message: 'REDIS_PASSWORD is not defined in .env' })
  REDIS_PASSWORD: string;
}
