import { IResetTokenRepository } from '@auth/interfaces/resettokens.interface';
import { ResetToken } from '@auth/models/resettokens.model';
import { BaseRespository } from '@database/repositories/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@user/models/users.model';
import { Model } from 'mongoose';

export class ResetTokenRepository
  extends BaseRespository<ResetToken>
  implements IResetTokenRepository
{
  constructor(@InjectModel(ResetToken.name) private readonly resetTokenModel: Model<ResetToken>) {
    super(resetTokenModel);
  }

  async createToken(user: User, token: string): Promise<ResetToken> {
    return await this.create({ user, token });
  }

  async getByTokenAndUser(user: User, token: string): Promise<ResetToken | null> {
    return await this.findOne({ user, token });
  }
}
