import { AppConfigModule } from '@config/config.module';
import { AppConfigService } from '@config/config.service';
import { DbProviderModule } from '@database/provider.module';
import { Module } from '@nestjs/common';
import { RolesModule } from '@role/roles.module';
import { SeederService } from '@seeder/seeder.service';
import { UsersModule } from '@user/users.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    DbProviderModule,
    AppConfigModule,
    RolesModule,
    UsersModule,
    LoggerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        const isProd = appConfigService?.NODE_ENV.toLowerCase() == 'production' ? true : false;
        return {
          pinoHttp: isProd
            ? {
                name: 'customLogger',
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
                name: 'customLogger',
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
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
