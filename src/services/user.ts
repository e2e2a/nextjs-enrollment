'use server';
import { hashPassword } from '@/lib/hash/bcrypt';
import { User } from '@/models/User';
import { deleteStudentProfileByUserId } from './studentProfile';

export const createUser = async (data: any, password: string) => {
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      ...data,
      password: hashedPassword,
    });
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log('error creating user', error)
    return null;
  }
};

export const getUsers = async () => {
  const users = await User.find();
  return users;
};

export const checkUserUsername = async (username: string) => {
  const user = await User.findOne({
    username,
    emailVerified: {
      $ne: undefined,
    },
  });
  if (user) return user;
  return null;
};

export const getUserByUsername = async (username: string) => {
  try {
    const u = await User.findOne({ username });
    return u;
  } catch (error) {
    return null;
  }
};
export const getUserByEmail = async (email: string) => {
  try {
    const user = await User.findOne({ email });
    return user;
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
    const user = await getUserById(id);
    await deleteStudentProfileByUserId(user._id);
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

export const updateUserPasswordById = async (data: any) => {
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

export const updateUserImageById = async (id: string, data: any) => {
  try {
    const user = await User.findByIdAndUpdate(id, ...data, { new: true });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const user = await User.find().exec();
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};