import { BaseRespository } from '@database/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NotificationsRepository extends BaseRespository<Notification> {
  constructor(
    @InjectModel(Notification.name) private readonly notificationModel: Model<Notification>,
  ) {
    super(notificationModel);
  }
}
