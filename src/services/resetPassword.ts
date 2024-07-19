'use server';
import { ResetPassword } from '@/models/ResetPassword';
import jwt from 'jsonwebtoken';

export const getResetPasswordTokenById = async (id: string) => {
  try {
    const user = await ResetPassword.findById(id);
    return user;
  } catch (error) {
    return null;
  }
};

export const getResetPasswordTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await ResetPassword.findOne({ email });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const deleteResetPasswordTokenById = async (id: string) => {
  try {
    await ResetPassword.findByIdAndDelete(id);
    return true;
  } catch (error) {
    return false;
  }
};

export const deleteResetPasswordTokenByEmail = async (email: string) => {
  try {
    await ResetPassword.findOneAndDelete({ email });
    return true;
  } catch (error) {
    return false;
  }
};

export const generateResetPasswordToken = async (email: string) => {
  const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours in milliseconds
  const token = jwt.sign({ email, exp: expirationTime.getTime() }, process.env.JWT_SECRET!, { algorithm: 'HS256' });

  const existingToken = await getResetPasswordTokenByEmail(email);
  if (existingToken) {
    deleteResetPasswordTokenById(existingToken.id);
  }

  const verificationToken = await ResetPassword.create({
    email,
    token,
    expires: expirationTime,
  });
  if(!verificationToken) return null;
  return verificationToken;
};
