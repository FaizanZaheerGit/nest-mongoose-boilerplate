import bcrypt from 'bcryptjs';

const saltWorkFactor = process.env.SALT_WORK_FACTOR
  ? parseInt(process.env.SALT_WORK_FACTOR, 10)
  : 10;

export const generateHash = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, saltWorkFactor);
};

export const comparePassword = async (
  inputPassword: string,
  userPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(inputPassword, userPassword);
};
