import { Module } from '@nestjs/common';
import { UsersService } from '@user/users.service';
import { UsersController } from '@user/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@user/models/users.model';
import { UserRepository } from '@user/repositories/users.repository';
import { RolesModule } from '@role/roles.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), RolesModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
