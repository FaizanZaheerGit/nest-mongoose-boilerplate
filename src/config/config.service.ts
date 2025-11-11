// TODO: Make this Base Config Class and use registerAs for config level items like dbConfig, twilioConfig, appConfig etc
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigValidation } from '@config/config.validation';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService<ConfigValidation>) {}

  get PORT(): number {
    return Number(this.configService.get('PORT', 5000));
  }

  get NODE_ENV(): string {
    return this.configService.get('NODE_ENV', 'development');
  }

  get MONGODB_URI(): string | undefined {
    return this.configService.get('MONGODB_URI');
  }

  get FRONTEND_URL(): string {
    return this.configService.get('FRONTEND_URL', 'http://localhost:3000');
  }

  get JWT_SECRET(): string | undefined {
    return this.configService.get('JWT_SECRET');
  }

  get JWT_EXPIRY(): string | undefined {
    return this.configService.get('JWT_EXPIRY');
  }

  get SALT_WORK_FACTOR(): number {
    return this.configService.get('SALT_WORK_FACTOR', 10);
  }

  get ADMIN_NAME(): string | undefined {
    return this.configService.get('ADMIN_NAME');
  }

  get ADMIN_EMAIL(): string | undefined {
    return this.configService.get('ADMIN_EMAIL');
  }

  get ADMIN_PASSWORD(): string | undefined {
    return this.configService.get('ADMIN_PASSWORD');
  }

  // get SENDGRID_API_KEY(): string | undefined {
  //   return this.configService.get('SENDGRID_API_KEY');
  // }

  // get SENDGRID_FROM_EMAIL(): string | undefined {
  //   return this.configService.get('SENDGRID_FROM_EMAIL');
  // }

  get SMTP_HOST(): string | undefined {
    return this.configService.get('SMTP_HOST');
  }

  get SMTP_PORT(): number | undefined {
    return this.configService.get('SMTP_PORT');
  }

  get SMTP_USER(): string | undefined {
    return this.configService.get('SMTP_USER');
  }

  get SMTP_PASSWORD(): string | undefined {
    return this.configService.get('SMTP_PASSWORD');
  }

  get SMTP_FROM_EMAIL(): string | undefined {
    return this.configService.get('SMTP_FROM_EMAIL');
  }

  get TWILIO_ACCOUNT_SID(): string | undefined {
    return this.configService.get('TWILIO_ACCOUNT_SID');
  }

  get TWILIO_AUTH_TOKEN(): string | undefined {
    return this.configService.get('TWILIO_AUTH_TOKEN');
  }

  get TWILIO_FROM_NUMBER(): string | undefined {
    return this.configService.get('TWILIO_FROM_NUMBER');
  }

  get REDIS_HOST(): string | undefined {
    return this.configService.get('REDIS_HOST') || 'localhost';
  }

  get REDIS_PORT(): number | undefined {
    return this.configService.get('REDIS_PORT') || 6379;
  }

  get REDIS_USERNAME(): string | undefined {
    return this.configService.get('REDIS_USERNAME') || 'default';
  }

  get REDIS_PASSWORD(): string | undefined {
    return this.configService.get('REDIS_PASSWORD') || '';
  }

  get dbConfig(): { MONGODB_URI: string | undefined } {
    return { MONGODB_URI: this.configService.get('MONGODB_URI') };
  }

  get adminConfig(): {
    name: string | undefined;
    email: string | undefined;
    password: string | undefined;
  } {
    return {
      name: this.configService.get('ADMIN_NAME'),
      email: this.configService.get('ADMIN_EMAIL'),
      password: this.configService.get('ADMIN_PASSWORD'),
    };
  }

  // get sendGridConfig(): {
  //   SENDGRID_API_KEY: string | undefined;
  //   SENDGRID_FROM_EMAIL: string | undefined;
  // } {
  //   return {
  //     SENDGRID_API_KEY: this.configService.get('SENDGRID_API_KEY'),
  //     SENDGRID_FROM_EMAIL: this.configService.get('SENDGRID_FROM_EMAIL'),
  //   };
  // }

  get mailConfig(): {
    SMTP_HOST: string | undefined;
    SMTP_PORT: number | undefined;
    SMTP_USER: string | undefined;
    SMTP_PASSWORD: string | undefined;
    SMTP_FROM_EMAIL: string | undefined;
  } {
    return {
      SMTP_HOST: this.configService.get('SMTP_HOST'),
      SMTP_PORT: this.configService.get('SMTP_PORT'),
      SMTP_USER: this.configService.get('SMTP_USER'),
      SMTP_PASSWORD: this.configService.get('SMTP_PASSWORD'),
      SMTP_FROM_EMAIL: this.configService.get('SMTP_FROM_EMAIL'),
    };
  }

  get twilioConfig(): {
    TWILIO_ACCOUNT_SID: string | undefined;
    TWILIO_AUTH_TOKEN: string | undefined;
    TWILIO_FROM_NUMBER: string | undefined;
  } {
    return {
      TWILIO_ACCOUNT_SID: this.configService.get('TWILIO_ACCOUNT_SID'),
      TWILIO_AUTH_TOKEN: this.configService.get('TWILIO_AUTH_TOKEN'),
      TWILIO_FROM_NUMBER: this.configService.get('TWILIO_FROM_NUMBER'),
    };
  }

  getRedisConfig(): {
    host: string | undefined;
    port: number | undefined;
    username: string | undefined;
    password: string | undefined;
  } {
    return {
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
      username: this.configService.get('REDIS_USERNAME'),
      password: this.configService.get('REDIS_PASSWORD'),
    };
  }
}
