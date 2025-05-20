import { Module } from '@nestjs/common';
import { RolesService } from '@role/roles.service';
import { RolesController } from '@role/roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from '@role/models/roles.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
