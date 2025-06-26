import { IResetTokenRepository } from '@auth/interfaces/resettokens.repository.interface';
import { ResetToken } from '@auth/models/resettokens.model';
import { BaseRespository } from '@database/repositories/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@user/models/users.model';
import { Model, Types } from 'mongoose';

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
    return await this.findOne({ user, token }, {});
  }

  async updateTokensExpiryByUser(userId: string, isExpired: boolean): Promise<ResetToken | null> {
    return await this.findOneAndUpdate(
      { user: new Types.ObjectId(userId) },
      { $set: { isExpired: isExpired } },
    );
  }
}
