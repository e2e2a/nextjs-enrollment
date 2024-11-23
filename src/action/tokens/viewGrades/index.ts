'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getEnrollmentByUserId } from '@/services/enrollment';
import { resetPasswordTokenResponse } from '@/types';
import { checkToken } from '@/utils/actions/verificationToken';

/**
 * Handles query parents View Grades.
 *
 * @param {string} token
 */
export const getVGTokenByParamsTokenAction = async (token: string): Promise<resetPasswordTokenResponse> => {
  return tryCatch(async () => {
    await dbConnect();
    if (!token) return { error: 'no token provided', status: 403 };

    const checkedToken = await checkToken(token);
    if (checkedToken && checkedToken.error) return { error: 'Invalid Token Request', status: checkedToken.status };
    if (checkedToken.token.tokenType !== 'View Grades') return { error: 'Invalid Type Request', status: 403 };

    const a = await getEnrollmentByUserId(checkedToken.token.parentId);
    return { success: true, enrollment: JSON.parse(JSON.stringify(a)), status: 200 }; //return enrollment of the student by the userId of the token
  });
};
