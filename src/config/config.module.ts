import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import AppConfigurations from '@config/configuration';
import { AppConfigService } from '@config/config.service';
import { plainToInstance } from 'class-transformer';
import { ConfigValidation } from '@config/config.validation';
import { validateSync } from 'class-validator';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '../../.env'),
      load: [AppConfigurations],
      validate(config: Record<string, unknown>) {
        const validatedConfig = plainToInstance(ConfigValidation, config, {
          enableImplicitConversion: true,
        });

        const errors = validateSync(validatedConfig, {
          skipMissingProperties: false,
        });

        if (errors.length > 0) {
          throw new Error(
            'ENV validation error:\n' +
              errors.map((err) => Object.values(err.constraints ?? {}).join(', ')).join('\n'),
          );
        }
        return validatedConfig;
      },
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule implements OnModuleInit {
  onModuleInit() {
    console.log(`App Configurations Initialized!`);
  }
}
