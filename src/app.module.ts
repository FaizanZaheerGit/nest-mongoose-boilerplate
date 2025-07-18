import { Module } from '@nestjs/common';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { UsersModule } from '@user/users.module';
import { AuthModule } from '@auth/auth.module';
import { AppConfigModule } from '@config/config.module';
import { DbProviderModule } from '@database/provider.module';
import { SendgridModule } from '@src/sendgrid/sendgrid.module';
import { TwilioModule } from '@src/twilio/twilio.module';
import { RolesModule } from '@role/roles.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from 'nestjs-pino';
import { AppConfigService } from '@config/config.service';

@Module({
  imports: [
    EventEmitterModule.forRoot({ global: true }),
    LoggerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        const isProd = appConfigService?.NODE_ENV.toLowerCase() == 'production' ? true : false;
        return {
          pinoHttp: isProd
            ? {
                level: 'info',
                base: null,
                transport: {
                  target: 'pino/file',
                  options: {
                    destination: `logs/log-${new Date().toISOString().split('T')[0]}.log`,
                    mkdir: true,
                  },
                },
              }
            : {
                level: 'debug',
                transport: {
                  target: 'pino-pretty',
                  options: {
                    singeLine: true,
                    colorize: true,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                  },
                },
              },
        };
      },
    }),
    AppConfigModule,
    AuthModule,
    DbProviderModule,
    RolesModule,
    SendgridModule,
    TwilioModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
