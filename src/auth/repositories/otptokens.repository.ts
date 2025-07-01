import { IOtpTokenRepository } from '@auth/interfaces/otptokens.repository.interface';
import { OtpToken } from '@auth/models/otptokens.model';
import { BaseRespository } from '@database/repositories/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@user/models/users.model';
import { Model, Types } from 'mongoose';

export class OtpTokenRepository extends BaseRespository<OtpToken> implements IOtpTokenRepository {
  constructor(@InjectModel(OtpToken.name) private readonly otpTokenModel: Model<OtpToken>) {
    super(otpTokenModel);
  }

  async createToken(user: User, token: string): Promise<OtpToken> {
    return await this.create({ user, token });
  }

  async getByTokenAndUser(user: User, token: string): Promise<OtpToken | null> {
    return await this.findOne({ user, token }, {});
  }

  async updateTokenExpiryByUser(userId: string, isExpired: boolean): Promise<OtpToken | null> {
    return await this.findOneAndUpdate(
      { user: new Types.ObjectId(userId) },
      { $set: { isExpired: isExpired } },
    );
  }
}
