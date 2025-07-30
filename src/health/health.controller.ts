import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@Controller('/health')
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly httpHealthIndicator: HttpHealthIndicator,
    private readonly mongooseHealthIndicator: MongooseHealthIndicator,
  ) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @HealthCheck()
  healthCheck() {
    return this.healthCheckService.check([
      () => this.httpHealthIndicator.pingCheck('google', 'https://www.google.com'),
      () => this.mongooseHealthIndicator.pingCheck('mongo'),
    ]);
  }
}
