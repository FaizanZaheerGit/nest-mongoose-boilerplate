import { IRoleRepository } from '@role/interfaces/roles.repository.interface';
import { roleDefaultValues } from '@role/default/role.default';

export async function seedDefaultRoles(roleRepository: IRoleRepository) {
  try {
    const existingRole = await roleRepository.getSingleRole({});
    if (existingRole) {
      console.log(`A role already exists`);
      return true;
    } else {
      await roleRepository.insertMany(roleDefaultValues);
      console.log(`Default Roles Seeded`);
    }
    return false;
  } catch (error) {
    console.log(`Error in seeding Default Roles:  ${error}`);
  }
}
