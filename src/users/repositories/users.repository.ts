import { BaseRespository } from '@database/repositories/base.repository';
import { FilterQuery, Model, Types } from 'mongoose';
import { User } from '@user/models/users.model';
import { UserTypeEnums } from '@utils/enums/userType.enums';
import { IUserRepository } from '@user/interfaces/users.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends BaseRespository<User> implements IUserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super(userModel);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.findOne(
      { email },
      { populate: { path: 'roles', select: 'title rights' }, lean: true },
    );
  }

  async getSingleActiveAdmin(): Promise<User | null> {
    return await this.findOne({ userType: UserTypeEnums.ADMIN }, {});
  }

  async getUsers(filterQuery: FilterQuery<User>): Promise<User[]> {
    return await this.findAll(filterQuery, { projection: { password: 0 } }, false);
  }

  async getCursorBasedUsers(
    filterQuery: FilterQuery<User>,
    cursor: string,
    limit: number,
  ): Promise<User[]> {
    return await this.findAll(
      { ...filterQuery, ...(cursor ? { _id: { $gt: cursor } } : {}) },
      { projection: { password: 0 }, sort: { _id: 1 }, limit: limit + 1 },
    );
  }

  async getSingleUser(filterQuery: FilterQuery<User>): Promise<User | null> {
    return await this.findOne(filterQuery, { projection: { password: 0 } });
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.findOne(
      { _id: new Types.ObjectId(id) },
      { projection: { password: 0 }, populate: { path: 'roles', select: 'title rights' } },
    );
  }

  async updateUserById(id: string, updateQuery: Partial<User>) {
    return await this.findOneAndUpdate({ _id: new Types.ObjectId(id) }, { $set: updateQuery }, {});
  }
}
