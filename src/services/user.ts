'use server';
import { hashPassword } from '@/lib/hash/bcrypt';
import Users from '@/models/Users';
import { IUser, IUserData, IUserPassword } from '@/types';

export const createUser = async (data: IUserData, password: string) => {
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = await Users.create({
      ...data,
      password: hashedPassword,
    });
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    return null;
  }
};

export const getUsers = async () => {
  const users = await Users.find();
  return users;
};

export const checkUserUsername = async (username: string) => {
  const users = await Users.find({
    username,
    emailVerified: {
      $ne: null,
    },
  });
  if (users && users.length > 0) return true;
  return false;
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await Users.findOne({ email });
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    return null;
  }
};

export const getUserById: any = async (id: string) => {
  try {
    const user = await Users.findById(id);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    return null;
  }
};
/**
 * @todo
 */
export const deleteUserByEmail = async (email: string) => {
  const existingUser = await getUserByEmail(email);

  if (existingUser && existingUser.emailVerified) {
    return null;
  }

  await Users.findOneAndDelete({ email });
  return true;
};

/**
 * @todo use the type in the update
 */
export const updateUserEmailVerifiedById = async (id: string) => {
  try {
    const user = await Users.findByIdAndUpdate(id, { emailVerified: new Date() }, { new: true });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateUserPasswordById = async (data: IUserPassword) => {
  const { id, password } = data;
  const existingUser = await getUserById(id);
  if (!existingUser) {
    throw new Error('Could not find user');
  }

  const hashedPassword = await hashPassword(password);

  const newPassword = await Users.findByIdAndUpdate(existingUser?.id, { password: hashedPassword }, { new: true });
  return newPassword;
};
