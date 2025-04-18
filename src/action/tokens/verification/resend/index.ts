'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { sendEmail } from '@/lib/mail/mail';
import { User } from '@/models/User';
import { checkToken } from '@/utils/actions/verificationToken';
import { generateVerificationCode } from '@/utils/actions/verificationToken/code';

/**
 * Handles query resend verification code
 *
 * @param {Object} data
 */
export const verificationCodeResend = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();

    if (!data.token) return { error: 'No token provided', status: 400 };

    const checkedToken = await checkToken(data.token);
    if (!checkedToken || checkedToken.error) return { error: checkedToken.error, status: checkedToken.status };

    const result = await resendVerificationCodeIfUserExists(checkedToken.token);
    if (!result || result.error) return { error: result.error, status: result.status };
    return { token: result.token, message: 'hello', status: 200 };
  });
};

/**
 *
 * @param {Object} token
 */
const resendVerificationCodeIfUserExists = async (token: any) => {
  return tryCatch(async () => {
    const verification = await generateVerificationCode(token.userId._id);
    if ('error' in verification) return { error: 'Something went wrong.', status: 403 };

    const user = await User.findById(token.userId._id);
    if (!user) return { error: 'User not found', status: 403 };
    await sendEmail(user.email, user.username, 'Resend Verification', 'auth', verification.code, 'Resend Verification');

    const filtered = { token: verification.token };
    return { token: filtered, message: 'hello', status: 200 };
  });
};
