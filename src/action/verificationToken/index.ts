'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getVerificationTokenByUserId } from '@/services/token';
import { getUserById } from '@/services/user';
import { checkAuth } from '@/utils/actions/session';
import { checkToken, checkTokenType } from '@/utils/actions/verificationToken';
import jwt from 'jsonwebtoken';

/**
 * Handles query checking verification token in the params
 *
 * @param {string} token
 */
export const getTokenByParamsTokenAction = async (token: string): Promise<any> => {
  return tryCatch(async () => {
    await dbConnect();
    if (!token) return { error: 'No token provided', status: 400 };

    const checkedToken = await checkToken(token);
    if (!checkedToken || checkedToken.error) return { error: checkedToken.error, status: checkedToken.status };

    const checkedType = await checkTokenType(checkedToken.token.userId.id, checkedToken.token.tokenType);
    if (!checkedType || checkedType.error) return { error: checkedType.error, status: checkedType.status };

    return { success: true, status: 200 };
  });
};
