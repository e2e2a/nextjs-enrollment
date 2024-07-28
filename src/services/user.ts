'use server';
import { hashPassword } from '@/lib/hash/bcrypt';
import {User} from '@/models/User';
import { IUserData, IUserPassword } from '@/types';
import { deleteStudentProfileByUserId } from './studentProfile';
import dbConnect from '@/lib/db/db';

export const createUser = async (data: IUserData, password: string) => {
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      ...data,
      password: hashedPassword,
    });
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    return null;
  }
};

export const getUsers = async () => {
  const users = await User.find();
  return users;
};

export const checkUserUsername = async (username: string) => {
  const users = await User.find({
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
    const user = await User.findOne({ email });
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    return null;
  }
};

export const getUserById: any = async (id: string) => {
  try {
    const user = await User.findById(id);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    return null;
  }
};
/**
 * @todo
 */

export const deleteUserById = async (id: string) => {
  try {
    const user = await getUserById(id)
    await deleteStudentProfileByUserId(user._id)
    await User.findByIdAndDelete(id);
    return true;
  } catch (error) {
    return false;
  }
};
export const deleteUserByEmail = async (email: string) => {
  const existingUser = await getUserByEmail(email);

  if (existingUser && existingUser.emailVerified) {
    return null;
  }

  await User.findOneAndDelete({ email });
  return true;
};

/**
 * @todo use the type in the update
 */
export const updateUserEmailVerifiedById = async (id: string) => {
  try {
    const user = await User.findByIdAndUpdate(id, { emailVerified: new Date() }, { new: true });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateUserPasswordById = async (data: IUserPassword) => {
  await dbConnect()
  const { id, password } = data;
  const existingUser = await getUserById(id);
  if (!existingUser) {
    throw new Error('Could not find user');
  }

  const hashedPassword = await hashPassword(password);

  const newPassword = await User.findByIdAndUpdate(existingUser?.id, { password: hashedPassword }, { new: true });
  return newPassword;
};

export const updateUserLogin = async (id: string) => {
  try {
    const user = await User.findByIdAndUpdate(id, { lastLogin: new Date() }, { new: true });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateUserLogout = async (id: string) => {
  try {
    const user = await User.findByIdAndUpdate(id, { lastLogout: new Date() }, { new: true });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
