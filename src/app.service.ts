import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import mongoose from 'mongoose';

@Injectable()
export class AppService implements OnApplicationShutdown {
  constructor(
    @InjectQueue('auth-queue') private readonly authQueue: Queue,
    private readonly logger: PinoLogger,
  ) {}

  async onApplicationShutdown(signal: string) {
    this.logger.warn(`\n\n${signal} Signal initiated clean shutdown!`);
    await this.cleanShutdown();
  }

  getHello(): string {
    return 'Hello World!';
  }

  async cleanShutdown() {
    // NOTE: For any other connections or bull queues add them here to close them cleanly

    this.logger.info('Intiating Clean Shutdown...');
    this.logger.warn('Closing Mongoose Connection...');
    await mongoose.connection.close();
    this.logger.info(`Mongoose Connection Closed Successfully...`);
    this.logger.warn(`Closing ${this.authQueue.name} Bull MQ...`);
    await this.authQueue.close();
    this.logger.info(`${this.authQueue.name} Bull MQ Closed Successfully...`);
    process.exit(1);
  }
}
