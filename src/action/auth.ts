'use server';
import { signIn } from '@/auth';
import { comparePassword } from '@/lib/hash/bcrypt';
import { checkingIp } from '@/lib/limiter/checkingIp';
import { getIpAddress } from '@/lib/limiter/getIp';
import rateLimit from '@/lib/limiter/rate-limit';
import { sendVerificationEmail } from '@/lib/mail/mail';
import { SigninValidator, SignupValidator } from '@/lib/validators/Validator';
import { checkUserUsername, createUser, deleteUserByEmail, getUserByEmail, updateUserIpById } from '@/services/user';
import { generateVerificationToken } from '@/services/verification-token';
import { SignInResponse, SignUpResponse } from '@/types';
import { AuthError } from 'next-auth';

/**
 * Performs sign-in.
 * @param data Any data structure.
 */
export const signInAction = async (data: any): Promise<SignInResponse> => {
  try {
    const validatedFields = SigninValidator.safeParse(data);

    if (!validatedFields.success) {
      return { error: 'Invalid fields!', status: 400 };
    }

    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);
    try {
      const myLimit = await rateLimit(6, email);
    } catch (error) {
      return { error: 'Rate Limit exceeded.', limit: true, status: 429 };
    }
    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: 'Incorrect email or password.', status: 403 };
    }

    if (!existingUser.emailVerified) return { error: 'Incorrect email or password.', status: 403 };

    const isMatch = await comparePassword(password, existingUser.password as string);

    if (!isMatch) return { error: 'Incorrect email or password.', status: 403 };

    const userIp = await checkingIp(existingUser);
    if(userIp.errorIp) return { error: 'Forbidden.', status: 403 };
    if (!userIp || userIp.error || !userIp.success) {
      const tokenType = 'Activation';
      const verificationToken = await generateVerificationToken(email, tokenType);
      return { token: verificationToken.token, status: 203 };
    }
    console.log(userIp)
    try {
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      return { message: 'Login successful', status: 200 };
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
  } catch (error) {
    console.error('Error processing request:', error);
    return { error: 'Something went wrong.', status: 500 };
  }
};

/**
 * Performs sign-up.
 * @param data Any data structure.
 */
export const signUpAction = async (data: any): Promise<SignUpResponse> => {
  try {
    const validatedFields = SignupValidator.safeParse(data);

    if (!validatedFields.success) {
      return { error: 'Invalid fields!', status: 400 };
    }

    const { email, password, firstname, username, lastname } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      if (existingUser.emailVerified) {
        return { error: 'User already exist. Please sign in to continue.', status: 409 };
      }
      const checkUsername = await checkUserUsername(username);
      console.log('checkUsername', checkUsername);
      if (checkUsername) {
        return { error: 'Username already exist. Please provide another username.', status: 409 };
      }
      await deleteUserByEmail(email);
    }
    const dataToCreate = {
      email: email,
      firstname: firstname,
      lastname: lastname,
      username: username,
      password: password,
    };
    await createUser(dataToCreate);
    const tokenType = 'Verify';
    const verificationToken = await generateVerificationToken(email, tokenType);
    await sendVerificationEmail(verificationToken.email, verificationToken.code, firstname, 'Confirm your Email');
    return { message: 'Confirmation email sent!', token: verificationToken.token, status: 201 };
  } catch (error) {
    console.error('Error processing request:', error);
    return { error: 'Something went wrong.', status: 500 };
  }
};
