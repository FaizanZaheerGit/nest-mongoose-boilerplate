import { Module } from '@nestjs/common';
import { RolesService } from '@role/roles.service';
import { RolesController } from '@role/roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from '@role/models/roles.model';
import { RoleRepository } from './repositories/roles.repository';

// TODO: Try Lazy Loading Modules to see how it affects performance and start up time
@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
  controllers: [RolesController],
  providers: [RolesService, RoleRepository],
  exports: [RolesService, RoleRepository],
})
export class RolesModule {}
