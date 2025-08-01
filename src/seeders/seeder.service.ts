import { AppConfigService } from '@config/config.service';
import { Inject, Injectable } from '@nestjs/common';
import { IRoleRepository } from '@role/interfaces/roles.repository.interface';
import { RoleRepository } from '@role/repositories/roles.repository';
import { seedDefaultRoles } from '@seeder/roles/roles.seed';
import { seedFirstAdminUser } from '@seeder/users/user.seed';
import { IUserRepository } from '@user/interfaces/users.repository.interface';
import { UserRepository } from '@user/repositories/users.repository';

@Injectable()
export class SeederService {
  constructor(
    @Inject(AppConfigService) private readonly appConfigService: AppConfigService,
    @Inject(UserRepository) private readonly userRepository: IUserRepository,
    @Inject(RoleRepository) private readonly roleRepository: IRoleRepository,
  ) {}

  async firstAdminSeedScript() {
    return await seedFirstAdminUser(this.userRepository, this.appConfigService.adminConfig);
  }

  async defaultRolesSeedScript() {
    return await seedDefaultRoles(this.roleRepository);
  }
}
