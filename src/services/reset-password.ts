'use server';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

export const getResetPasswordTokenById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};

export const getResetPasswordTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.resetPassword.findFirst({
      where: { email },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const deleteResetPasswordTokenById = async (id: string) => {
  try {
    await db.user.delete({
      where: {
        id,
      },
    });
    return;
  } catch (error) {
    return null;
  }
};

export const deleteResetPasswordTokenByEmail = async (email: string) => {
  try {
    await db.resetPassword.delete({
      where: {
        email: email,
      },
    });
    return;
  } catch (error) {
    return null;
  }
};

export const generateResetPasswordToken = async (email: string) => {
  const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours in milliseconds
  const token = jwt.sign({ email, exp: expirationTime.getTime() }, process.env.JWT_SECRET!, { algorithm: 'HS256' });

  const existingToken = await getResetPasswordTokenByEmail(email);
  if (existingToken) {
    deleteResetPasswordTokenById(existingToken.id)
  }

  const verificationToken = await db.resetPassword.create({
    data: {
      email,
      token,
      expires: expirationTime,
    },
  });
  return verificationToken;
};