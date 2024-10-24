'use server';
import { ResetPassword } from '@/models/ResetPasswords';
import { getUserByEmail, getUserById } from '@/services/user';
import { getVerificationTokenByUserId } from '@/services/token';
import { checkTokenResponse, resetPasswordTokenResponse } from '@/types';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db/db';
import { checkAuth } from '../utils/actions/session';

/**
 * Performs checking verification token in the params
 *
 * @param token string
 */
export const checkToken = async (token: string): Promise<checkTokenResponse> => {
  try {
    await dbConnect();
    if (!token) return { error: 'no token provided', status: 400 };
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ['HS256'],
    }) as jwt.JwtPayload;

    if (!decodedToken) {
      return { error: 'Invalid token', status: 400 };
    }
    const existingToken = await getVerificationTokenByUserId(decodedToken.userId);
    if (!existingToken) {
      return { error: 'Token not found', status: 404 };
    }

    const existingUser = await getUserById(decodedToken.userId);

    switch (existingToken.tokenType) {
      case 'ChangeEmail':
        const session = await checkAuth();
        if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
        if (session.user._id !== existingToken.userId._id) return { error: 'Forbidden', status: 403 };
        break;
      case 'Activation':
      case 'Recovery':
        if (!existingUser || !existingUser.emailVerified) {
          return { error: 'User email is not verified. Redirecting to recovery page...', status: 400 };
        }
        break;
      case 'Verify':
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
    await dbConnect();
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
