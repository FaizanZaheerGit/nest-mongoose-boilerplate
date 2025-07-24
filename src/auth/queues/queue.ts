import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class AuthQueue {
  constructor(@InjectQueue('auth-queue') private readonly authQueue: Queue) {}

  async addSendEmailJob(data: any) {
    await this.authQueue.add('send-email', data, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 4000 },
    });
  }

  async addSendSmsJob(data: any) {
    await this.authQueue.add('send-sms', data, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 4000 },
    });
  }
}
