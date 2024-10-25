'use server';
import { comparePassword } from '@/lib/hash/bcrypt';
import rateLimit from '@/lib/limiter/rate-limit';
import { sendVerificationEmail } from '@/lib/mail/mail';
import { getUserByEmail } from '@/services/user';
import { generateVerificationToken } from '@/services/token';
import dbConnect from '@/lib/db/db';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { fireAuth } from '@/firebase';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { SigninValidator } from '@/lib/validators/auth/signIn';
import { handleSignInAction } from '@/utils/actions/auth/signIn';
import { checkingIp } from '@/utils/actions/userIp';

/**
 * Handles the user sign-in process.
 *
 * @param {any} data - The sign-in data provided by the user (typically includes email and password).
 */
export const signInAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const validatedFields = SigninValidator.safeParse(data);
    if (!validatedFields.success) return { error: 'Invalid fields!', status: 400 };

    const checkedUser = await checkUser(validatedFields.data);
    if (!checkedUser || checkedUser.error) return { error: checkedUser.error, token: checkedUser?.token, status: checkedUser.status };

    const signedIn = await handleSignInAction(checkedUser.user._id, checkedUser.user.email, checkedUser.user.password);
    if (signedIn && signedIn.error) return { error: signedIn.error, status: signedIn.status };
    return { message: signedIn.message, role: checkedUser.user.role, status: signedIn.status };
  });
};

/**
 * Verifies the user's credentials and checks various conditions for login.
 *
 * @param {any} data - The user-provided sign-in data, including email and password.
 */
const checkUser = async (data: any) => {
  return tryCatch(async () => {
    const existingUser = await getUserByEmail(data.email);
    const isLimit = await myLimit(data.email);
    if (!isLimit || isLimit.error || !isLimit.success) return { error: 'Rate Limit exceeded.', limit: true, status: 429 };

    if (!existingUser || !existingUser.email || !existingUser.password) return { error: 'Incorrect email or password.', status: 403 };
    if (!existingUser.emailVerified) return { error: 'Incorrect email or password.', status: 403 };

    const isMatch = await comparePassword(data.password, existingUser.password as string);
    if (!isMatch) return { error: 'Incorrect email or password.', status: 403 };

    const checkedIp = await checkIp(existingUser);
    if (checkedIp && checkedIp.error) return { error: 'Confirming Email', token: checkedIp.token, status: 203 };
    return { success: 'yesyes', user: existingUser, status: 201 };
  });
};

/**
 * Enforces rate limiting on actions based on the user's email.
 *
 * @param {string} email - The email address used to track rate limits for the user.
 */
const myLimit = async (email: string) => {
  try {
    const p = await rateLimit(6, email);
    return { success: 'go', status: 201 };
  } catch (error) {
    return { error: 'Rate Limit exceeded.', limit: true, status: 429 };
  }
};

/**
 * Checks the user's IP address .
 *
 * @param {any} user - The user object containing information needed to verify the IP.
 */
const checkIp = async (user: any) => {
  return tryCatch(async () => {
    const userIp = await checkingIp(user);
    if (userIp.errorIp) return { error: `Forbidden ${userIp.errorIp}`, status: 403 };
    if (!userIp || userIp.error || !userIp.success) {
      const verificationToken = await generateVerificationToken(user._id, 'Activation');
      console.log('userIpqqqq: ', verificationToken);
      return { error: 'New Ip', token: verificationToken.token, status: 203 };
    }
    return { success: 'Old Ip', status: 200 };
  });
};
