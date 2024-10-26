'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { resetPasswordTokenResponse } from '@/types';
import { checkRPToken } from '@/utils/actions/resetPasswordToken';

/**
 * Handles query Reset Password.
 *
 * @param {string} token
 */
export const getRPTokenByParamsTokenAction = async (token: string): Promise<resetPasswordTokenResponse> => {
  return tryCatch(async () => {
    await dbConnect();
    if (!token) return { error: 'no token provided', status: 403 };

    const checkedToken = await checkRPToken(token);
    if (checkedToken && checkedToken.error) return { error: 'Invalid Token Request', status: '403' };

    return { success: true, status: 200 };
  });
};


