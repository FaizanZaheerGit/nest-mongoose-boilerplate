import { generateHash } from '@src/utils/bcrypt';
import { IUserRepository } from '@user/interfaces/users.repository.interface';

export async function seedFirstAdminUser(
  userRepository: IUserRepository,
  adminDetails: {
    email: string | undefined;
    password: string | undefined;
    name: string | undefined;
  },
) {
  try {
    const existingAdmin = await userRepository.getSingleActiveAdmin();
    adminDetails['password'] = await generateHash(String(adminDetails?.password));
    if (existingAdmin) {
      console.log(`An Admin already exists`);
      return true;
    } else {
      await userRepository.create(adminDetails);
      console.log(`First Admin User Created!`);
    }
    return false;
  } catch (error) {
    console.log(`Error in creating First Admin User:  ${error}`);
  }
}
