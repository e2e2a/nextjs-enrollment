'use server';
import { getIpAddress } from '@/lib/limiter/getIp';
import { generateVerificationCode } from '@/lib/helpers/verificationCode';
import { sendVerificationEmail } from '@/lib/mail/mail';
import { generateResetPasswordToken } from '@/services/resetPassword';
import { getUserById, updateUserById, updateUserEmailVerifiedById } from '@/services/user';
import { deleteVerificationTokenByid, getVerificationTokenByUserId } from '@/services/token';
import { verificationCodeProcessResponse, verificationCodeResendResponse } from '@/types';
import { createActiveIp, updateActiveIp } from '@/services/userIp';
import { signIn } from '@/auth';
import dbConnect from '@/lib/db/db';
import { checkAuth } from '../utils/actions/session';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { checkNewEmail } from '@/utils/actions/user/email';

/**
 * Performs submitting verification code(6-digit)
 *
 * @param token string
 */
export const verificationCodeProcess = async (data: any): Promise<verificationCodeProcessResponse> => {
  const { userId, verificationCode, Ttype } = data;
  try {
    await dbConnect();
    const userToken = await getVerificationTokenByUserId(userId);
    if (!userToken) return { error: 'Somethings went wrong', status: 403 };

    const hasExpired = new Date(userToken.expiresCode) < new Date();
    if (hasExpired) return { error: 'Verification Code has expired.', status: 410 };

    if (verificationCode !== userToken.code) return { error: 'Verification Code not match.', status: 403 };

    const user = await getUserById(userToken.userId);
    if (!user) return { error: 'User not found', status: 404 };

    const ip = await getIpAddress();
    if (!ip) return { error: 'Invalid request type', status: 404 };
    let redirect;
    if (user.role === 'ADMIN') {
      redirect = '/admin';
    } else if (user.role === 'STUDENT') {
      redirect = '/';
    } else if (user.role === 'TEACHER') {
      redirect = '/';
    } else if (user.role === 'DEAN') {
      redirect = '/dean';
    }
    switch (Ttype) {
      case 'ChangeEmail':
        const session = await checkAuth();
        if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
        const checkedNewEmail = await checkNewEmail(userToken.emailToChange);
        if (checkedNewEmail && checkedNewEmail.error) {
          await deleteVerificationTokenByid(userToken._id);
          return { error: 'Email is already been used in another account.', status: 500 };
        }
        const updatedEmail = await updateUserEmail(user, userToken.emailToChange);
        if (updatedEmail && updatedEmail.error) return { error: updatedEmail.error, status: 500 };
        // await signIn('credentials', {
        //   email: userToken.emailToChange,
        //   redirect: false,
        // });
        await deleteVerificationTokenByid(userToken._id);
        return { redirect: redirect, status: 201 };
      case 'Recovery':
        const RPtoken = await generateResetPasswordToken(userId);
        await deleteVerificationTokenByid(userToken._id);
        return { token: RPtoken, status: 201 };

      case 'Activation':
        await deleteVerificationTokenByid(userToken._id);
        await updateActiveIp(user._id, ip);
        await signIn('credentials', {
          email: user.email,
          redirect: false,
        });
        return { redirect: '/admin', status: 201 };
      case 'Verify':
        await updateUserEmailVerifiedById(user._id);
        await createActiveIp(user._id, ip);
        await deleteVerificationTokenByid(userToken._id);
        return { redirect: '/sign-in', status: 201 };
      default:
        return { error: 'Invalid request type', status: 400 };
    }
  } catch (error) {
    console.log(error);
    return { error: 'Internal Server Error', status: 500 };
  }
};

export const verificationCodeResend = async (data: any): Promise<verificationCodeResendResponse> => {
  await dbConnect();
  const { userId } = data;
  const verification = await generateVerificationCode(userId);
  if ('error' in verification) {
    console.log(verification.error);
    return { error: 'Something went wrong.', status: 403 };
  }
  const User = await getUserById(verification.userId);
  if (!User) return { error: 'User not found', status: 403 };
  await sendVerificationEmail(verification.email, verification.code, User.firstname, 'Resend Verification');
  return { verification: verification, message: 'hello', status: 200 };
};

const updateUserEmail = async (user: any, email: string) => {
  return tryCatch(async () => {
    const updatedUser = await updateUserById(user._id, { email: email });
    if (!updatedUser) return { error: 'Failed to update the email.', status: 403 };

    return { success: true, status: 201 };
  });
};
