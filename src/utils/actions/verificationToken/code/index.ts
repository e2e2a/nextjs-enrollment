'use server';
import { getVerificationTokenByUserId } from '@/services/token';
import { Token } from '@/models/Token';

export const generateRandomString = async () => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  return result;
};

export const generateVerificationCode = async (userId: string) => {
  const existingToken = await getVerificationTokenByUserId(userId);
  if (!existingToken) return { error: 'Forbidden' };
  const activitionCode = await generateRandomString();
  const expireCode = new Date(new Date().getTime() + 5 * 60 * 1000);

  const verificationToken = await Token.findByIdAndUpdate(existingToken._id, { code: activitionCode, expiresCode: expireCode }, { new: true });
  return verificationToken;
};
