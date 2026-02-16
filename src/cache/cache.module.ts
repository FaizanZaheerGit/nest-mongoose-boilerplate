import { Global, Module } from '@nestjs/common';
import { CacheRedisService } from './cache.service';
// import { CacheRedisController } from './cache.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { AppConfigService } from '@config/config.service';
import KeyvRedis from '@keyv/redis';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async(appConfigService: AppConfigService) => {
        return {
          stores: [
            new KeyvRedis(
              `redis://${appConfigService.REDIS_HOST}:${appConfigService.REDIS_PORT}`
            ),
          ],
          ttl: 60_000 // NOTE: Test TTL and change accordingly
        }
      },
      inject: [AppConfigService],
      isGlobal: true,
    }),
  ],
  // controllers: [CacheRedisController],
  providers: [CacheRedisService],
})
export class CacheRedisModule {}
