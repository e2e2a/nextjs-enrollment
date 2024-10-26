'use server';
import { ResetPassword } from '@/models/ResetPasswords';
import jwt from 'jsonwebtoken';
/**
 *
 * @todo remove token naming convention
 * @returns
 */
export const getResetPasswordById = async (id: string) => {
  try {
    const user = await ResetPassword.findById(id);
    return user;
  } catch (error) {
    return null;
  }
};

export const getResetPasswordByEmail = async (email: string) => {
  try {
    const verificationToken = await ResetPassword.findOne({ email });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const deleteResetPasswordById = async (id: string) => {
  try {
    await ResetPassword.findByIdAndDelete(id);
    return true;
  } catch (error) {
    return false;
  }
};

export const getResetPasswordByUserId = async (userId: string) => {
  try {
    const p = await ResetPassword.findOne({ userId });
    return p;
  } catch (error) {
    return null;
  }
};

export const deleteResetPasswordByEmail = async (email: string) => {
  try {
    await ResetPassword.findOneAndDelete({ email });
    return true;
  } catch (error) {
    return false;
  }
};

export const generateResetPasswordToken = async (userId: string) => {
  const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours in milliseconds
  const token = jwt.sign({ userId, exp: expirationTime.getTime() }, process.env.JWT_SECRET!, { algorithm: 'HS256' });
  const existingToken = await getResetPasswordByUserId(userId);

  if (existingToken) await deleteResetPasswordById(existingToken._id);

  const verificationToken = await ResetPassword.create({
    userId,
    token,
    expires: expirationTime,
  });
  if (!verificationToken) return null;
  return verificationToken;
};
