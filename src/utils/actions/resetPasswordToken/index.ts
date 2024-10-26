"use server"
import { tryCatch } from "@/lib/helpers/tryCatch";
import { ResetPassword } from "@/models/ResetPasswords";
import jwt from 'jsonwebtoken';

export const checkRPToken = async (token: string) => {
  return tryCatch(async () => {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ['HS256'],
    }) as jwt.JwtPayload;

    const existingToken = await ResetPassword.findOne({ userId: decodedToken.userId }).populate('userId');
    if (!existingToken) return { error: 'Please ensure the token you provided.', status: 404 };

    return { token: existingToken, status: 200 };
  });
};
