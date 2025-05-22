import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { UserRepository } from './repositories/users.repository';
import { IUserRepository } from './interfaces/users.repository.interface';
import { AppConfigService } from '@config/config.service';
import { seedFirstAdminUser } from './seeders/user.seed';
@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @Inject(UserRepository) private readonly userRepository: IUserRepository,
    @Inject(AppConfigService) private readonly appConfigService: AppConfigService,
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
}
