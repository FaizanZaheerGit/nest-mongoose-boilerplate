import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class CacheRedisService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
        private logger: PinoLogger,
    ) {
        this.logger.setContext(CacheRedisService.name);
    }

    async onModuleDestroy() {
       await this.cache.disconnect();
    }

    async setDataByKey<T>(key: string,  val: T, ttlSeconds?: number): Promise<void> {
        try {
          await this.cache.set(key, val, ttlSeconds ?? undefined);
        } catch (error) {
          this.logger.error(`Error in Setting redis Data By Key:  ${error}`);

          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async getDataByKey<T>(key: string): Promise<T | null> {
        try {
          const cacheData = await this.cache.get(key) as T;
          return cacheData ?? null;
        } catch (error) {
          this.logger.error(`Error in Getting redis Data By Key:  ${error}`);

          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async deleteDataByKey(key: string): Promise<void> {
        try {
           await this.cache.del(key);
        } catch (error) {
          this.logger.error(`Error in Deleting redis Data By Key:  ${error}`);

          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
