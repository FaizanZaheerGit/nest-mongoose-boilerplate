import { Module } from '@nestjs/common';
import { UsersService } from '@user/users.service';
import { UsersController } from '@user/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@user/models/users.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
