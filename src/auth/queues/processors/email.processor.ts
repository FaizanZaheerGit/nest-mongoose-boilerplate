import { Processor } from '@nestjs/bullmq';

@Processor('email-queue')
export class SendEmailProcessor {}
