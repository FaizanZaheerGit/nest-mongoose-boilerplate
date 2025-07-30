import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { RoleRepository } from '@role/repositories/roles.repository';
import { IRoleRepository } from '@role/interfaces/roles.repository.interface';
import { CreateRoleDto } from '@role/dto/create-role.dto';
import { ReadRolesDto } from '@role/dto/read-role.dto';
import { ReadPaginatedRolesDto } from '@role/dto/read-paginated-role';
import { UpdateRoleDto } from '@role/dto/update-role.dto';
import { DefaultRoleEnums } from '@enums/defaultRoles.enum';
import { StatusEnums } from '@enums/status.enums';
import { seedDefaultRoles } from '@role/seeders/role.seed';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    @Inject(RoleRepository) private readonly roleRepository: IRoleRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(RolesService.name);
  }

  async onModuleInit() {
    await seedDefaultRoles(this.roleRepository);
  }

  async getRoleByIds(ids: string[]) {
    try {
      return await this.roleRepository.getRoleByIds(ids);
    } catch (error) {
      this.logger.error(`Error in get role by ids service:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createRole(createRoleDto: CreateRoleDto) {
    try {
      const { title } = createRoleDto;
      const existingRoleTitle = await this.roleRepository.getRoleByTitle(title);
      if (existingRoleTitle) {
        throw new HttpException(`Role with title already exists`, HttpStatus.CONFLICT);
      }
      const newRole = await this.roleRepository.create(createRoleDto);
      return { entity: newRole };
    } catch (error) {
      this.logger.error(`Error in create role service:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async readAllRoles(readRoleDto: ReadRolesDto) {
    try {
      const roles = await this.roleRepository.getRoles(readRoleDto);
      return { entities: roles };
    } catch (error) {
      console.error(`Error in read roles service:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async readCursorBasedRoles(readRoleDto: ReadRolesDto) {
    try {
      const { cursor, limit, ...filterQuery } = readRoleDto;
      // TODO: remove this and handle DTO and Validation Pipe properly to avoid undefined values
      const cleanedFilterQuery = Object.entries(filterQuery)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, v]) => v !== undefined)
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
      // TODO: End of Todo
      const roles = await this.roleRepository.getCursorBasedRoles(
        cleanedFilterQuery,
        cursor,
        limit,
      );
      const hasNext = roles.length > limit;
      if (hasNext) {
        roles.pop();
      }
      const nextCursor = hasNext ? roles[roles.length - 1]._id : null;
      return { entities: roles, hasNext, nextCursor };
    } catch (error) {
      this.logger.error(`Error in read cursor based roles service:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async readPaginatedRoles(readPaginatedRolesDto: ReadPaginatedRolesDto) {
    try {
      const { page, limit, ...filterQuery } = readPaginatedRolesDto;

      // TODO: remove this and handle DTO and Validation Pipe properly to avoid undefined values
      const cleanedFilterQuery = Object.entries(filterQuery)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, v]) => v !== undefined)
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
      // TODO: End of Todo

      const [roles, totalCount] = await Promise.all([
        this.roleRepository.findPaginated(page, limit, cleanedFilterQuery, {}, false), // TODO: change this getPaginated function from role repo
        this.roleRepository.countDocuments(filterQuery),
      ]);
      const totalPages = Math.ceil(totalCount / limit);
      const hasNext: boolean = page < totalPages;
      return {
        entities: roles,
        meta: { currentPage: page, hasNext, pageSize: limit, totalCount, totalPages },
      };
    } catch (error) {
      this.logger.error(`Error in read paginated roles service:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async readRoleById(id: string) {
    try {
      const existingRole = await this.roleRepository.getRoleById(id);
      if (!existingRole) {
        throw new HttpException('Role not found', HttpStatus.BAD_REQUEST);
      }
      return { entity: existingRole };
    } catch (error) {
      this.logger.error(`Error in read role by id service:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      const existingRole = await this.roleRepository.getRoleById(id);
      if (!existingRole) {
        throw new HttpException(`Role not found!`, HttpStatus.BAD_REQUEST);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if (Object.values(DefaultRoleEnums).includes(existingRole.title as any)) {
        throw new HttpException(`Cannot update pre-defined roles`, HttpStatus.BAD_REQUEST);
      }
      if (updateRoleDto?.title) {
        const existingRoleByTitle = await this.roleRepository.getRoleByTitle(updateRoleDto.title);
        if (existingRoleByTitle) {
          throw new HttpException(`Role with title already exists!`, HttpStatus.CONFLICT);
        }
      }
      await this.roleRepository.updateRoleById(id, updateRoleDto);
      return {};
    } catch (error) {
      this.logger.error(`Error in update role service:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteRole(id: string) {
    try {
      const existingRole = await this.roleRepository.getRoleById(id);
      if (!existingRole) {
        throw new HttpException(`Role not found!`, HttpStatus.BAD_REQUEST);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if (Object.values(DefaultRoleEnums).includes(existingRole.title as any)) {
        throw new HttpException(`Cannot delete pre-defined roles`, HttpStatus.BAD_REQUEST);
      }
      await this.roleRepository.updateRoleById(id, { status: StatusEnums.DELETED });
      return {};
    } catch (error) {
      this.logger.error(`Error in delete role service:  ${error}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
