import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class AuthQueues {
  constructor(
    @InjectQueue('email-queue') private readonly emailQueue: Queue,
    @InjectQueue('sms-queue') private readonly smsQueue: Queue,
  ) {}
}
