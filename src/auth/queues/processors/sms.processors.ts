import { Processor } from '@nestjs/bullmq';

@Processor('sms-queue')
export class SmsQueueProcessor {}
