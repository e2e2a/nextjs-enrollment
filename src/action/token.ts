'use server';
import { getUserByEmail } from '@/services/user';
import { getVerificationTokenByEmail } from '@/services/verification-token';
import { checkTokenResponse } from '@/types';
import jwt from 'jsonwebtoken';

/**
 * Performs checking token in the params
 *
 * @param token string
 */
export const checkToken = async (token: string): Promise<checkTokenResponse> => {
  try {
    if(!token) return {error: 'no token provided', status: 400}
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ['HS256'],
    }) as jwt.JwtPayload;

    if (!decodedToken) {
      return { error: 'Invalid token', status: 400 };
    }

    const existingToken = await getVerificationTokenByEmail(decodedToken.email);
    if (!existingToken) {
      return { error: 'Token not found', status: 404 };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    switch (existingToken.tokenType) {
      case 'Activation':
      case 'Recovery':
        console.log(existingToken.tokenType);
        if (!existingUser || !existingUser.emailVerified) {
          return { error: 'User email is not verified. Redirecting to recovery page...', status: 400 };
        }
      case 'Verify':
        console.log('Verify');
        if (!existingUser) {
          return { error: 'User not found.', status: 404 };
        }
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { error: 'Token has expired', status: 400 };
    }

    return { existingToken: existingToken, status: 200 };
  } catch (error: any) {
    return { error: `An unexpected error occurred ${error}`, status: 500 };
  }
};
