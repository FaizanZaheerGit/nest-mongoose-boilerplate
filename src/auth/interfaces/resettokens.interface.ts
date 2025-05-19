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
import { ResetToken } from '@auth/models/resettokens.model';
import { User } from '@user/models/users.model';

export abstract class IResetTokenRepository {
  abstract create(data: Partial<ResetToken>): Promise<ResetToken>;
  abstract findAll(
    filterQuery: FilterQuery<ResetToken>,
    queryOptions: QueryOptions<ResetToken>,
    isDeleted?: boolean,
  ): Promise<ResetToken[]>;
  abstract findPaginated(
    page: number,
    limit: number,
    filterQuery: FilterQuery<ResetToken>,
    queryOptions: QueryOptions<ResetToken>,
    isDeleted?: boolean,
  ): Promise<ResetToken[]>;
  abstract findOne(
    filterQuery: FilterQuery<ResetToken>,
    queryOptions: QueryOptions<ResetToken>,
  ): Promise<ResetToken | null>;
  abstract countDocuments(
    filterQuery: FilterQuery<ResetToken>,
    isDeleted?: boolean,
  ): Promise<number>;
  abstract findOneAndUpdate(
    filterQuery: FilterQuery<ResetToken>,
    updateQuery: UpdateQuery<ResetToken>,
    queryOptions: QueryOptions<ResetToken>,
  ): Promise<ResetToken | null>;
  abstract updateMany(
    filterQuery: FilterQuery<ResetToken>,
    updateQuery: UpdateQuery<ResetToken>,
  ): Promise<UpdateWriteOpResult>;
  abstract deleteOne(filterQuery: FilterQuery<ResetToken>): Promise<DeleteResult>;
  abstract deleteMany(filterQuery: FilterQuery<ResetToken>): Promise<DeleteResult>;
  abstract aggregate(stages: PipelineStage[], options?: AggregateOptions): Promise<Aggregate<any>>;
  abstract createToken(user: any, token: string): Promise<ResetToken>;
  abstract getByTokenAndUser(user: User, token: string): Promise<ResetToken | null>;
}
