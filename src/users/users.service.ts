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

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @Inject(UserRepository) private readonly userRepository: IUserRepository,
    @Inject(AppConfigService) private readonly appConfigService: AppConfigService,
    @Inject(RolesService) private readonly roleService: RolesService,
  ) {}

  async onModuleInit() {
    const adminDeatils = this.appConfigService.adminConfig;
    await seedFirstAdminUser(this.userRepository, adminDeatils);
  }

  async getUserByEmail(email: string) {
    try {
      return await this.userRepository.getUserByEmail(email);
    } catch (error) {
      console.log(`Error in User Service get User by Email:  ${error}`);
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
      console.error(`Error in create user service:  =>  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async readAllUsers(readUsersDto: ReadUsersDto) {
    try {
      const users = await this.userRepository.getUsers(readUsersDto);
      return { entities: users };
    } catch (error) {
      console.error(`Error in get users service:  =>  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async readCursorBasedUsers(readUsersDto: ReadUsersDto) {
    try {
      // TODO: Work on this
      const users = await this.userRepository.getUsers(readUsersDto);
      return { entities: users };
    } catch (error) {
      console.error(`Error in get cursor based users service:  =>  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async readPaginatedUsers(readPaginatedUsersDto: ReadPaginatedUsersDto) {
    try {
      const { page, limit, ...filterQuery } = readPaginatedUsersDto;
      const [users, totalCount] = await Promise.all([
        this.userRepository.findPaginated(page, limit, filterQuery, {}, false), // TODO: change this getPaginated function from user repo
        this.userRepository.countDocuments(filterQuery),
      ]);
      const totalPages = Math.ceil(totalCount / limit);
      const hasNext: boolean = page < totalPages;
      return {
        entities: users,
        meta: { currentPage: page, hasNext, pageSize: limit, totalCount, totalPages },
      };
    } catch (error) {
      console.error(`Error in read paginated users service:  ${error}`);
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
      console.error(`Error in read user by id service:  ${error}`);
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
      console.error(`Error in update user service:  ${error}`);
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
      console.error(`Error in delete user service:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
