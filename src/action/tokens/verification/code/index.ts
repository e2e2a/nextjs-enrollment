'use server';
import { generateResetPasswordToken } from '@/services/resetPassword';
import { getUserById, updateUserById, updateUserEmailVerifiedById } from '@/services/user';
import { deleteVerificationTokenByid, getVerificationTokenByUserId } from '@/services/token';
import { createActiveIp, updateActiveIp } from '@/services/userIp';
import { signIn } from '@/auth';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { checkNewEmail } from '@/utils/actions/user/email';
import { handleSignInAction } from '@/utils/actions/auth/signIn';
import { checkAuth } from '@/utils/actions/session';
import { checkToken } from '@/utils/actions/verificationToken';
import { checkingIp } from '@/utils/actions/userIp';
import { redirectUrlByRole } from '@/utils/helpers/redirectUrlByRole';
import { createNotification } from '@/services/notification';

/**
 * Performs submitting verification code(6-digit)
 *
 * @param token string
 */
export const verificationCodeAction = async (data: any): Promise<any> => {
  return tryCatch(async () => {
    await dbConnect();
    if (!data.token) return { error: 'No token provided', status: 400 };

    const checkedToken = await checkToken(data.token);
    if (!checkedToken || checkedToken.error) return { error: checkedToken.error, status: checkedToken.status };

    if (data.verificationCode !== checkedToken.token.code) return { error: 'Verification Code not match.', status: 403 };

    const user = await getUserById(checkedToken.token.userId._id);
    if (!user) return { error: 'User not found', status: 404 };

    const userIp = await checkIp(user);
    if (!userIp || userIp.error) return { error: userIp.error, status: userIp.status };
    const url = await redirectUrlByRole(user.role);
    if (url && url.error) return { error: url.error, status: url.status };

    const checkedTokenType = await checkTokenType(user, checkedToken.token, url.url);
    if (checkedTokenType && checkedTokenType.error) return { error: checkedTokenType.error, status: checkedTokenType.status };
    return checkedTokenType;
  });
};

/**
 * Handles check ip
 * @param {Object} user
 */
const checkIp = async (user: any) => {
  return tryCatch(async () => {
    const ip = await checkingIp(user);
    if (ip.errorIp) return { error: `Forbidden ${ip.errorIp}`, status: 403 };
    if (!ip || ip.error || !ip.success) {
      const p = await updateActiveIp(user._id, ip.ip);
      if (!p) return { error: `Forbidden ${ip.error}`, status: 500 };
    }
    return { success: 'yesyes', status: 201 };
  });
};

/**
 * Handles Token Type
 * 
 * @param {Object} user
 * @param {Object} token
 */
const checkTokenType = async (user: any, token: any, url: string) => {
  switch (token.tokenType) {
    case 'ChangeEmail':
      const resultChangeEmail = await handleChangeEmail(user, token);
      if (resultChangeEmail && resultChangeEmail.error) return { error: resultChangeEmail.error, status: resultChangeEmail.status };
      return { redirect: url, status: resultChangeEmail.status };
    case 'Activation':
      const resultActivation = await handleActivation(user, token);
      if (resultActivation && resultActivation.error) return { error: resultActivation.error, status: resultActivation.status };
      return { redirect: url, status: resultActivation.status };
    case 'Recovery':
      const resultRecovery = await handleRecovery(token);
      if (resultRecovery && resultRecovery.error) return { error: resultRecovery.error, status: resultRecovery.status };
      return { token: resultRecovery.token.token, status: 201 };
    case 'Verify':
      const resultVerify = await handleVerify(user, token);
      if (resultVerify && resultVerify.error) return { error: resultVerify.error, status: resultVerify.status };
      await createNotification({to: user._id, title: 'Welcome and explore our website!', link: '/' })
      return { redirect: '/sign-in', status: 201 };
    default:
      return { error: 'Invalid request type', status: 400 };
  }
};

/**
 *
 * @param {Object} user
 * @param {Object} token
 */
const handleChangeEmail = async (user: any, token: any) => {
  return tryCatch(async () => {
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    const checkedNewEmail = await checkNewEmail(token.emailToChange);
    if (checkedNewEmail && checkedNewEmail.error) {
      await deleteVerificationTokenByid(token._id);
      return { error: 'Email is already been used in another account.', status: checkedNewEmail.status };
    }
    const updatedEmail = await updateUserEmail(user, token.emailToChange);
    if (updatedEmail && updatedEmail.error) return { error: updatedEmail.error, status: 500 };

    const signedInChangeEmail = await handleSignInAction(token.userId._id, updatedEmail.email);
    if (signedInChangeEmail && signedInChangeEmail.error) return { error: signedInChangeEmail.error, status: signedInChangeEmail.status };

    await deleteVerificationTokenByid(token._id);
    return { success: 'yesyes', status: 201 };
  });
};

/**
 *
 * @param {Object} user
 * @param {Object} token
 */
const handleActivation = async (user: any, token: any) => {
  return tryCatch(async () => {
    await deleteVerificationTokenByid(token._id);
    const signedIn = await handleSignInAction(token.userId._id, user.email);
    if (signedIn && signedIn.error) return { error: signedIn.error, status: signedIn.status };
    return { success: 'yes', status: 201 };
  });
};

/**
 *
 * @param {Object} token
 */
const handleRecovery = async (token: any) => {
  return tryCatch(async () => {
    const RPtoken = await generateResetPasswordToken(token.userId._id);
    await deleteVerificationTokenByid(token._id);
    return { success: 'yes', token: RPtoken, status: 201 };
  });
};

/**
 * 
 * @param {Object} user
 * @param {Object} token
 */
const handleVerify = async (user: any, token: any) => {
  return tryCatch(async () => {
    await updateUserEmailVerifiedById(user._id);
    await deleteVerificationTokenByid(token._id);
  });
};

/**
 * Handles update user email
 * 
 * @param {Object} user
 * @param {string} email
 */
const updateUserEmail = async (user: any, email: string) => {
  return tryCatch(async () => {
    const updatedUser = await updateUserById(user._id, { email: email });
    if (!updatedUser) return { error: 'Failed to update the email.', status: 403 };

    return { success: 'yesyes', status: 201 };
  });
};
