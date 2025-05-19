import { Global, Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigService } from '@config/config.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => ({
        uri: appConfigService.MONGODB_URI,
      }),
    }),
  ],
  providers: [],
  exports: [],
})
export class DbProviderModule implements OnModuleInit {
  onModuleInit() {
    console.log('DB Initialized Successfully');
  }
}
