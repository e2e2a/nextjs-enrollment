'use server';
import { Token } from '@/models/Token';
import { generateRandomString } from '@/utils/actions/verificationToken/code';
import jwt from 'jsonwebtoken';

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await Token.findOne({ token });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByUserId = async (userId: string) => {
  try {
    const verificationToken = await Token.findOne({ userId })
      .populate({
        path: 'userId',
        select: '-password',
      })
      .exec();
    return JSON.parse(JSON.stringify(verificationToken));
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByParentId = async (parentId: string) => {
  try {
    const verificationToken = await Token.findOne({ parentId }).populate('parentId').exec();
    return JSON.parse(JSON.stringify(verificationToken));
  } catch (error) {
    return null;
  }
};

export const deleteVerificationTokenByid = async (id: string) => {
  try {
    await Token.findByIdAndDelete(id);
    return true;
  } catch (error) {
    return false;
  }
};

export const generateVerificationToken = async (userId: string, TokenType: string, emailToChange?: string) => {
  const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours in milliseconds
  const token = jwt.sign({ userId, exp: expirationTime.getTime() }, process.env.JWT_SECRET!, { algorithm: 'HS256' });

  const existingToken = await getVerificationTokenByUserId(userId);
  if (existingToken) {
    await deleteVerificationTokenByid(existingToken._id);
  }

  const activitionCode = await generateRandomString();
  const expireCode = new Date(new Date().getTime() + 5 * 60 * 1000);

  const verificationToken = await Token.create({
    userId,
    emailToChange: emailToChange,
    token,
    code: activitionCode,
    tokenType: TokenType,
    expires: expirationTime,
    expiresCode: expireCode,
  });
  return verificationToken;
};

export const generateViewGradeToken = async (parentId: string, TokenType: string) => {
  const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const token = jwt.sign({ parentId, exp: expirationTime.getTime() }, process.env.JWT_SECRET!, { algorithm: 'HS256' });

  const existingToken = await getVerificationTokenByParentId(parentId);
  if (existingToken) {
    await deleteVerificationTokenByid(existingToken._id);
  }

  const verificationToken = await Token.create({
    parentId,
    token,
    tokenType: TokenType,
    expires: expirationTime,
  });
  return verificationToken;
};
