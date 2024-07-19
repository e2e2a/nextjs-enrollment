'use server';
import { ResetPassword } from '@/models/ResetPassword';
import { getUserByEmail, getUserById } from '@/services/user';
import { getVerificationTokenByUserId } from '@/services/token';
import { checkTokenResponse, resetPasswordTokenResponse } from '@/types';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db/db';

/**
 * Performs checking verification token in the params
 *
 * @param token string
 */
export const checkToken = async (token: string): Promise<checkTokenResponse> => {
  try {
    await dbConnect()
    if (!token) return { error: 'no token provided', status: 400 };
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ['HS256'],
    }) as jwt.JwtPayload;

    if (!decodedToken) {
      return { error: 'Invalid token', status: 400 };
    }
    console.log(decodedToken.userId)
    const existingToken = await getVerificationTokenByUserId(decodedToken.userId);
    console.log('existingToken',existingToken)
    if (!existingToken) {
      return { error: 'Token not found', status: 404 };
    }
    const existingUser = await getUserById(decodedToken.userId);

    switch (existingToken.tokenType) {
      case 'Activation':
      case 'Recovery':
        console.log(existingToken.tokenType);
        if (!existingUser || !existingUser.emailVerified) {
          return { error: 'User email is not verified. Redirecting to recovery page...', status: 400 };
        }
        break;
      case 'Verify':
        console.log('Verify');
        if (!existingUser) {
          return { error: 'User not found.', status: 404 };
        }
        break;
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { error: 'Token has expired', status: 400 };
    }

    return { token: existingToken, status: 200 };
  } catch (error: any) {
    return { error: `An unexpected error occurred ${error}`, status: 500 };
  }
};

/**
 * Performs checking reset-password token in the params
 *
 * @param token string
 */
export const checkResetPasswordToken = async (token: string): Promise<resetPasswordTokenResponse> => {
  try {
    await dbConnect()
    if (!token) return { error: 'no token provided', status: 400 };
    const userToken = await ResetPassword.findOne({ token });
    if (!userToken) {
      return { error: 'Invalid token', status: 404 };
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ['HS256'],
    }) as jwt.JwtPayload;

    const existingToken = await ResetPassword.findOne({ email: decodedToken.email, token: decodedToken.token });

    if (!existingToken) {
      return { error: 'Please ensure the token you provided.', status: 404 };
    }
    return { token: existingToken, status: 200 };
  } catch (err) {
    return { error: 'Internal server error.', status: 500 };
  }
};
