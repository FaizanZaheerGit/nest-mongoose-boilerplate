import {
  Aggregate,
  AggregateOptions,
  DeleteResult,
  FilterQuery,
  Model,
  PipelineStage,
  QueryOptions,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';
import { StatusEnums } from '@utils/enums/status.enums';

export class BaseRespository<T> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async insertMany(data: Partial<T>[]): Promise<any> {
    return await this.model.insertMany(data);
  }

  async findAll(
    filterQuery: FilterQuery<T>,
    queryOptions: QueryOptions<T> = {},
    isDeleted: boolean = false,
  ): Promise<T[]> {
    return await this.model.find(
      { ...(isDeleted ? {} : { status: { $ne: StatusEnums.DELETED } }), ...filterQuery },
      null,
      { sort: { createdAt: -1 }, ...queryOptions },
    );
  }

  async findPaginated(
    page: number,
    limit: number,
    filterQuery: FilterQuery<T>,
    queryOptions: QueryOptions<T> = {},
    isDeleted: boolean = false,
  ): Promise<T[]> {
    return await this.model.find(
      { ...(isDeleted ? {} : { status: { $ne: StatusEnums.DELETED } }), ...filterQuery },
      null,
      { skip: (page - 1) * limit, limit: limit, sort: { createdAt: -1 }, ...queryOptions },
    );
  }

  async findOne(
    filterQuery: FilterQuery<T>,
    queryOptions: QueryOptions<T> = {},
  ): Promise<T | null> {
    return await this.model.findOne(
      { status: { $ne: StatusEnums.DELETED }, ...filterQuery },
      null,
      queryOptions,
    );
  }

  async countDocuments(filterQuery: FilterQuery<T>, isDeleted: boolean = false): Promise<number> {
    return await this.model.countDocuments({
      ...(isDeleted ? {} : { status: { $ne: StatusEnums.DELETED } }),
      ...filterQuery,
    });
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updateQuery: UpdateQuery<T>,
    queryOptions: QueryOptions<T> = {},
  ): Promise<T | null> {
    return await this.model.findOneAndUpdate(filterQuery, updateQuery, queryOptions);
  }

  async updateMany(
    filterQuery: FilterQuery<T>,
    updateQuery: UpdateQuery<T>,
  ): Promise<UpdateWriteOpResult> {
    return await this.model.updateMany(filterQuery, updateQuery);
  }

  async deleteOne(filterQuery: FilterQuery<T>): Promise<DeleteResult> {
    return await this.model.deleteOne(filterQuery);
  }

  async deleteMany(filterQuery: FilterQuery<T>): Promise<DeleteResult> {
    return await this.model.deleteMany(filterQuery);
  }

  async aggregate(
    stages: PipelineStage[],
    options: AggregateOptions = {},
  ): Promise<Aggregate<any>> {
    return await this.model.aggregate(stages, options);
  }
}
