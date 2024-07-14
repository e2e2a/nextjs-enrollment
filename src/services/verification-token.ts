'use server';
import db from '@/lib/db';
import { generateRandomString } from '@/lib/helpers/verificationCode';
import jwt from 'jsonwebtoken';

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const deleteVerificationTokenByEmail = async (email: string) => {
  try {
    await db.verificationToken.delete({
      where: {
        email: email,
      },
    });
    return;
  } catch (error) {
    return null;
  }
};

export const deleteVerificationTokenByid = async (id: string) => {
  try {
    await db.verificationToken.delete({
      where: {
        id,
      },
    });
    return;
  } catch (error) {
    return null;
  }
};

export const generateVerificationToken = async (email: string, TokenType: string) => {
  const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours in milliseconds
  const token = jwt.sign({ email, exp: expirationTime.getTime() }, process.env.JWT_SECRET!, { algorithm: 'HS256' });

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await deleteVerificationTokenByid(existingToken.id);
  }

  const activitionCode = await generateRandomString();
  const expireCode = new Date(new Date().getTime() + 5 * 60 * 1000);

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      code: activitionCode,
      tokenType: TokenType,
      expires: expirationTime,
      expiresCode: expireCode,
    },
  });
  return verificationToken;
};
