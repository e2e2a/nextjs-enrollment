'use server';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getVerificationTokenByUserId } from '@/services/token';
import { getUserById } from '@/services/user';
import { checkAuth } from '@/utils/actions/session';
import jwt from 'jsonwebtoken';

/**
 * Checks the type of token and validates user permissions based on the provided token type.
 *
 * @param {string} id
 * @param {string} tokenType
 */
export const checkTokenType = async (id: string, tokenType: string) => {
    return tryCatch(async () => {
      const existingUser = await getUserById(id);
      switch (tokenType) {
        case 'ChangeEmail':
          const session = await checkAuth();
          if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
          if (session.user._id !== existingUser._id) return { error: 'Forbidden', status: 403 };
          break;
        case 'Activation':
        case 'Recovery':
          if (!existingUser || !existingUser.emailVerified) return { error: 'User email is not verified. Redirecting to recovery page...', status: 400 };
          break;
        case 'Verify':
          if (!existingUser) return { error: 'User not found.', status: 404 };
          break;
      }
      return { success: 'yesyes', status: 200 };
    });
  };
  
  /**
   * Verifies a token by decoding it, checking its existence, and ensuring it hasn't expired.
   * 
   * @param {string} token
   */
  export const checkToken = async (token: string) => {
    return tryCatch(async () => {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET!, {
        algorithms: ['HS256'],
      }) as jwt.JwtPayload;
      if (!decodedToken) return { error: 'Invalid token', status: 400 };
      
      const existingToken = await getVerificationTokenByUserId(decodedToken.userId);
      if (!existingToken) return { error: 'Token not found', status: 404 };
      const hasExpired = new Date(existingToken.expires) < new Date();
      if (hasExpired) return { error: 'Token has expired', status: 400 };
  
      return { success: 'yesyes', token: existingToken, status: 200 };
    });
  };