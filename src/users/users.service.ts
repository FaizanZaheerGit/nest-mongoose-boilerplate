import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { UserRepository } from '@user/repositories/users.repository';
import { IUserRepository } from '@user/interfaces/users.repository.interface';
import { AppConfigService } from '@config/config.service';
import { seedFirstAdminUser } from '@user/seeders/user.seed';
import { RolesService } from '@role/roles.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { StatusEnums } from '@enums/status.enums';
import { ReadUsersDto } from '@user/dto/read-user.dto';
import { ReadPaginatedUsersDto } from '@user/dto/read-paginated-user.dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { User } from '@user/models/users.model';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @Inject(UserRepository) private readonly userRepository: IUserRepository,
    @Inject(AppConfigService) private readonly appConfigService: AppConfigService,
    @Inject(RolesService) private readonly roleService: RolesService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UsersService.name);
  }

  async onModuleInit() {
    const adminDeatils = this.appConfigService.adminConfig;
    await seedFirstAdminUser(this.userRepository, adminDeatils);
  }

  async getUserByEmail(email: string) {
    try {
      return await this.userRepository.getUserByEmail(email);
    } catch (error) {
      this.logger.error(`Error in User Service get User by Email:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getUserById(id: string) {
    try {
      return await this.userRepository.getUserById(id);
    } catch (error) {
      this.logger.error(`Error in User Service get User by Id:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.getUserByEmail(createUserDto.email);
      if (existingUser) {
        throw new HttpException('User with email already exists', HttpStatus.CONFLICT);
      }
      if (createUserDto?.roleIds && createUserDto?.roleIds.length) {
        const existingRoles = await this.roleService.getRoleByIds(createUserDto?.roleIds);
        if (
          !existingRoles ||
          !existingRoles.length ||
          existingRoles.length < createUserDto?.roleIds.length
        ) {
          throw new HttpException(`Role not found`, HttpStatus.BAD_REQUEST);
        } else {
          createUserDto['roles'] = existingRoles;
        }
      }
      const newUser = await this.userRepository.create({
        ...createUserDto,
        status: StatusEnums.PENDING,
      });
      return { entity: newUser };
    } catch (error) {
      this.logger.error(`Error in create user service:  =>  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async readCursorBasedUsers(readUsersDto: ReadUsersDto) {
    try {
      this.logger.info(`Test Log`);
      const { cursor, limit, ...filterQuery } = readUsersDto;

      // TODO: remove this and handle DTO and Validation Pipe properly to avoid undefined values
      const cleanedFilterQuery = Object.entries(filterQuery)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, v]) => v !== undefined)
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
      // TODO: End of Todo

      const users = await this.userRepository.getCursorBasedUsers(
        cleanedFilterQuery,
        cursor,
        limit,
      );
      const hasNext = users.length > limit;
      if (hasNext) {
        users.pop();
      }
      const nextCursor = hasNext ? users[users.length - 1]._id : null;
      return { entities: users, hasNext, nextCursor };
    } catch (error) {
      this.logger.error(`Error in get cursor based users service:  =>  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async readPaginatedUsers(readPaginatedUsersDto: ReadPaginatedUsersDto) {
    try {
      const { page, limit, ...filterQuery } = readPaginatedUsersDto;

      // TODO: remove this and handle DTO and Validation Pipe properly to avoid undefined values
      const cleanedFilterQuery = Object.entries(filterQuery)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, v]) => v !== undefined)
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
      // TODO: End of Todo

      const [users, totalCount] = await Promise.all([
        this.userRepository.findPaginated(page, limit, cleanedFilterQuery, {}, false), // TODO: change this getPaginated function from user repo
        this.userRepository.countDocuments(filterQuery),
      ]);
      const totalPages = Math.ceil(totalCount / limit);
      const hasNext: boolean = page < totalPages;
      return {
        entities: users,
        meta: { currentPage: page, hasNext, pageSize: limit, totalCount, totalPages },
      };
    } catch (error) {
      this.logger.error(`Error in read paginated users service:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  readCurrentUserDetails(currentUser: User) {
    try {
      return { user: currentUser };
    } catch (error) {
      this.logger.error(`Error in read current user details:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async readUserById(id: string) {
    try {
      const existingUser = await this.userRepository.getUserById(id);
      if (!existingUser) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      return { entity: existingUser };
    } catch (error) {
      this.logger.error(`Error in read user by id service:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const existingUser = await this.userRepository.getUserById(id);
      if (!existingUser) {
        throw new HttpException(`User not found!`, HttpStatus.BAD_REQUEST);
      }
      await this.userRepository.updateUserById(id, updateUserDto);
      return {};
    } catch (error) {
      this.logger.error(`Error in update user service:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateUserStatus(id: string, status: StatusEnums) {
    try {
      const existingUser = await this.userRepository.getUserById(id);
      if (!existingUser) {
        throw new HttpException(`User not found!`, HttpStatus.BAD_REQUEST);
      }
      await this.userRepository.updateUserById(id, { status });
      return {};
    } catch (error) {
      this.logger.error(`Error in update user service:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateUserPasswordById(id: string, newPassword: string) {
    try {
      const existingUser = await this.userRepository.getUserById(id);
      if (!existingUser) {
        throw new HttpException(`User not found!`, HttpStatus.BAD_REQUEST);
      }
      return await this.userRepository.updateUserById(id, { password: newPassword });
    } catch (error) {
      this.logger.error(`Error in update user service:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUser(id: string) {
    try {
      const existingUser = await this.userRepository.getUserById(id);
      if (!existingUser) {
        throw new HttpException(`User not found!`, HttpStatus.BAD_REQUEST);
      }
      await this.userRepository.updateUserById(id, { status: StatusEnums.DELETED });
      return {};
    } catch (error) {
      this.logger.error(`Error in delete user service:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
