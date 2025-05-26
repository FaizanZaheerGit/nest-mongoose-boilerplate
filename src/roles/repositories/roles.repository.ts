import { BaseRespository } from '@database/repositories/base.repository';
import { PermissionEnums } from '@enums/permissions.enum';
import { InjectModel } from '@nestjs/mongoose';
import { IRoleRepository } from '@role/interfaces/roles.repository.interface';
import { Role } from '@role/models/roles.model';
import { FilterQuery, Model, Types } from 'mongoose';

export class RoleRepository extends BaseRespository<Role> implements IRoleRepository {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {
    super(roleModel);
  }

  async getRoleByTitle(title: string): Promise<Role | null> {
    return await this.findOne({ title });
  }

  async getRolesByRights(rights: PermissionEnums[]): Promise<Role[] | null> {
    return await this.findAll({ rights: { $in: rights } });
  }

  async getRoles(filterQuery: FilterQuery<Role>): Promise<Role[]> {
    return await this.findAll(filterQuery);
  }

  async getSingleRole(filterQuery: FilterQuery<Role>): Promise<Role | null> {
    return await this.findOne(filterQuery);
  }

  async getRoleById(id: string): Promise<Role | null> {
    return await this.findOne({ _id: new Types.ObjectId(id) });
  }

  async getRoleByIds(ids: string[]): Promise<Role[]> {
    return await this.findAll({
      _id: { $in: ids.map((id) => new Types.ObjectId(id)) },
    });
  }

  async updateRoleById(id: string, updateQuery: Partial<Role>) {
    return await this.findOneAndUpdate({ _id: new Types.ObjectId(id) }, { $set: updateQuery });
  }
}
