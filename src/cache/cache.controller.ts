// import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
// import { CacheRedisService } from './cache.service';
// import { ResponseMessage } from '@decorators/responseMessage.decorator';

// @Controller('cacheRedis')
// export class CacheRedisController {
//   constructor(private readonly cacheService: CacheRedisService) {
//   }
//   @ResponseMessage('SUCCESS')
//   @Post('test-set')
//   testCacheSet(@Body() data: any) {
//     return this.cacheService.setDataByKey('test-key', data);
//   }

//   @ResponseMessage('SUCCESS')
//   @Get('test-get/:key')
//   testCacheGet(@Param('key') key: string) {
//     return this.cacheService.getDataByKey(key);
//   }

//   @ResponseMessage('SUCCESS')
//   @Delete('/test-delete/:key')
//   testCacheDelete(@Param('key') key: string) {
//     return this.cacheService.deleteDataByKey(key);
//   }
// }
