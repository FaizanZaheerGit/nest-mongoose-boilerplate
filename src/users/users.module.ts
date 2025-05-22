import { Module } from '@nestjs/common';
import { UsersService } from '@user/users.service';
import { UsersController } from '@user/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@user/models/users.model';
import { UserRepository } from './repositories/users.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
