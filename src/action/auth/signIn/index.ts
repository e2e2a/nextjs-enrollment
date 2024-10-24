'use server';
import { comparePassword } from '@/lib/hash/bcrypt';
import { checkingIp } from '@/lib/limiter/checkingIp';
import rateLimit from '@/lib/limiter/rate-limit';
import { sendVerificationEmail } from '@/lib/mail/mail';
import { getUserByEmail } from '@/services/user';
import { generateVerificationToken } from '@/services/token';
import { SignInResponse } from '@/types';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import dbConnect from '@/lib/db/db';
import { createStudentProfile, deleteStudentProfileByUserId } from '@/services/studentProfile';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { fireAuth } from '@/firebase';
import { User } from '@/models/User';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { SigninValidator } from '@/lib/validators/auth/signIn';

/**
 * Performs sign-in.
 * @param data Any data structure.
 */
export const signInAction = async (data: any): Promise<SignInResponse> => {
  return tryCatch(async () => {
    await dbConnect();
    const validatedFields = SigninValidator.safeParse(data);
    if (!validatedFields.success) return { error: 'Invalid fields!', status: 400 };

    const checkedUser = await checkUser(validatedFields.data);
    if (!checkedUser || checkedUser.error) return { error: checkedUser.error, status: checkedUser.status };

    const signedIn = await handleSignInAction(checkedUser.user._id, checkedUser.user.email, checkedUser.user.password);
    if (signedIn && signedIn.error) return { error: signedIn.error, status: signedIn.error };
    return { message: signedIn.message, role: checkedUser.user.role, status: signedIn.status };
  });
};
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

const myLimit = async (email: string) => {
  return tryCatch(async () => {
    try {
      const p = await rateLimit(6, email);
      return { success: 'go', status: 201 };
    } catch (error) {
      return { error: 'Rate Limit exceeded.', limit: true, status: 429 };
    }
  });
};

const checkIp = async (user: any) => {
  return tryCatch(async () => {
    const userIp = await checkingIp(user);
    if (userIp.errorIp) return { error: `Forbidden ${userIp.errorIp}`, status: 403 };
    if (!userIp || userIp.error || !userIp.success) {
      const tokenType = 'Activation';
      const verificationToken = await generateVerificationToken(user._id, tokenType);
      return { error: 'New Ip', token: verificationToken.token, status: 203 };
    }
    return { success: 'Old Ip', status: 200 };
  });
};
/**
 * Handles signing in using NextAuth.
 * @param {string} id - The user object retrieved from the database.
 * @param {string} email - The user object retrieved from the database.
 * @param {string} password - The user object retrieved from the database.
 * @returns Result The response object.
 */
export const handleSignInAction = async (id: string, email: string, password?: string) => {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    await User.findByIdAndUpdate(id, { active: true }, { new: true });
    return { message: 'Login successful', status: 201 };
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid Credentials.', status: 401 };
        default:
          return { error: 'Something went wrong.', status: 500 };
      }
    }
    return { error: 'Something went wrong.', status: 500 };
  }
};
