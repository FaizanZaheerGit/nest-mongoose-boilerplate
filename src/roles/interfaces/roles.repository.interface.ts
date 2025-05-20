import {
  Aggregate,
  AggregateOptions,
  DeleteResult,
  FilterQuery,
  PipelineStage,
  QueryOptions,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';
import { Role } from '@role/models/roles.model';
import { PermissionEnums } from '@enums/permissions.enum';

export abstract class IRoleRepository {
  abstract create(data: Partial<Role>): Promise<Role>;
  abstract findAll(
    filterQuery: FilterQuery<Role>,
    queryOptions: QueryOptions<Role>,
    isDeleted?: boolean,
  ): Promise<Role[]>;
  abstract findPaginated(
    page: number,
    limit: number,
    filterQuery: FilterQuery<Role>,
    queryOptions: QueryOptions<Role>,
    isDeleted?: boolean,
  ): Promise<Role[]>;
  abstract findOne(
    filterQuery: FilterQuery<Role>,
    queryOptions: QueryOptions<Role>,
  ): Promise<Role | null>;
  abstract countDocuments(filterQuery: FilterQuery<Role>, isDeleted?: boolean): Promise<number>;
  abstract findOneAndUpdate(
    filterQuery: FilterQuery<Role>,
    updateQuery: UpdateQuery<Role>,
    queryOptions: QueryOptions<Role>,
  ): Promise<Role | null>;
  abstract updateMany(
    filterQuery: FilterQuery<Role>,
    updateQuery: UpdateQuery<Role>,
  ): Promise<UpdateWriteOpResult>;
  abstract deleteOne(filterQuery: FilterQuery<Role>): Promise<DeleteResult>;
  abstract deleteMany(filterQuery: FilterQuery<Role>): Promise<DeleteResult>;
  abstract aggregate(stages: PipelineStage[], options?: AggregateOptions): Promise<Aggregate<any>>;
  abstract getRoleByTitle(title: string): Promise<Role | null>;
  abstract getRolesByRights(rights: PermissionEnums[]): Promise<Role[] | null>;
  abstract getRoleById(id: string): Promise<Role | null>;
  abstract getRoleByIds(ids: string[]): Promise<Role[]>;
  abstract getPaginatedRoles(
    page: number,
    limit: number,
    filterQuery: FilterQuery<Role>,
  ): Promise<Role[]>;
  abstract getRoles(filterQuery: FilterQuery<Role>): Promise<Role[]>;
  abstract getSingleRole(filterQuery: FilterQuery<Role>): Promise<Role | null>;
  abstract updateRoleById(id: string, updateQuery: Partial<Role>): Promise<Role | null>;
}
