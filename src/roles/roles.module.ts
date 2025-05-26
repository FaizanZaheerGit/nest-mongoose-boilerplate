import { Module } from '@nestjs/common';
import { RolesService } from '@role/roles.service';
import { RolesController } from '@role/roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from '@role/models/roles.model';
import { RoleRepository } from './repositories/roles.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
  controllers: [RolesController],
  providers: [RolesService, RoleRepository],
  exports: [RolesService],
})
export class RolesModule {}
