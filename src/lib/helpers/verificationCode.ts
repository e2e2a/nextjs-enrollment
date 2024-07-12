"use server";
import { getVerificationTokenByEmail } from "@/services/verification-token";
import db from "../db";

export const generateRandomString = async () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Uppercase letters and numbers
    let result = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    return result;
  };

  export const generateVerificationCode = async (email: string) => {
    const existingToken = await getVerificationTokenByEmail(email);
    if (!existingToken) {
      return { error: 'Forbidden' };
    }
    const activitionCode = await generateRandomString();
    const expireCode = new Date(new Date().getTime() + 5 * 60 * 1000);
  
    const verificationToken = await db.verificationToken.update({
      where: { id: existingToken.id },
      data: {
        code: activitionCode,
        expiresCode: expireCode,
      },
    });
    return verificationToken;
  };