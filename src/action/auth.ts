'use server';
import { comparePassword } from '@/lib/hash/bcrypt';
import { checkingIp } from '@/lib/limiter/checkingIp';
import rateLimit from '@/lib/limiter/rate-limit';
import { sendVerificationEmail } from '@/lib/mail/mail';
import { SigninValidator, SignupValidator } from '@/lib/validators/Validator';
import { checkUserUsername, createUser, deleteUserByEmail, getUserByEmail, getUserByUsername } from '@/services/user';
import { generateVerificationToken } from '@/services/token';
import { SignInResponse, SignUpResponse } from '@/types';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import dbConnect from '@/lib/db/db';
import { createStudentProfile, deleteStudentProfileByUserId } from '@/services/studentProfile';
import { signInWithEmailAndPassword } from "firebase/auth";
import { fireAuth } from '@/firebase';
/**
 * Performs sign-in.
 * @param data Any data structure.
 */
export const signInAction = async (data: any): Promise<SignInResponse> => {
  try {
    // await dbConnect();
    const validatedFields = SigninValidator.safeParse(data);
    if (!validatedFields.success) return { error: 'Invalid fields!', status: 400 };
    
    const { email, password } = validatedFields.data;
    // const userCredential = await signInWithEmailAndPassword(fireAuth, 'admin@gmail.com', 'qweqwe');
    // console.log('userCredential: ', userCredential)
    const existingUser = await getUserByEmail(email);
    // try {
    //   const myLimit = await rateLimit(6, email);
    // } catch (error) {
    //   return { error: 'Rate Limit exceeded.', limit: true, status: 429 };
    // }
    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: 'Incorrect email or password.', status: 403 };
    }

    if (!existingUser.emailVerified) return { error: 'Incorrect email or password.', status: 403 };
    const isMatch = await comparePassword(password, existingUser.password as string);

    if (!isMatch) return { error: 'Incorrect email or password.', status: 403 };

    // const userIp = await checkingIp(existingUser);
    // if (userIp.errorIp) return { error: `Forbidden ${userIp.errorIp}`, status: 403 };
    // if (!userIp || userIp.error || !userIp.success) {
    //   const tokenType = 'Activation';
    //   const verificationToken = await generateVerificationToken(existingUser._id, tokenType);
    //   return { token: verificationToken.token, status: 203 };
    // }
    // if(existingUser.role === 'ADMIN') {}
    try {
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      return { message: 'Login successful', role: existingUser.role, status: 200 };
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
    await dbConnect();
    const validatedFields = SignupValidator.safeParse(data);
    if (!validatedFields.success) return { error: 'Invalid fields!', status: 400 };

    const { email, password, username } = validatedFields.data;

    const checkConflict = await checkingConflict(email, username);
    if (!checkConflict.success) return { error: checkConflict?.error, status: checkConflict?.status };

    const newUser = await creatingUser(email, username, password);
    console.log('newUser auth:', newUser);
    return { message: 'Confirmation email sent!', token: newUser.token, status: 201 };
  } catch (error) {
    return { error: 'Something went wrong.', status: 500 };
  }
};

/**
 * Perfoms checking conflict of email and username
 * @returns string
 */
const checkingConflict = async (email: string, username: string) => {
  await dbConnect();
  const existingUser = await getUserByEmail(email);
  try {
    if (existingUser) {
      if (existingUser.emailVerified) {
        return { error: 'User already exist. Please sign in to continue.', status: 409 };
      }
      const checkUsername = await getUserByUsername(username);
      if (checkUsername) {
        if (checkUsername.emailVerified) {
          return { error: 'Username already exist. Please provide another username.', status: 409 };
        } else {
          await deleteStudentProfileByUserId(checkUsername._id);
          await deleteUserByEmail(checkUsername.email);
        }
      }
    } else {
      const checkUsername = await getUserByUsername(username);
      if (checkUsername) {
        if (checkUsername.emailVerified) {
          return { error: 'Username already exist. Please provide another username.', status: 409 };
        } else {
          await deleteStudentProfileByUserId(checkUsername._id);
          await deleteUserByEmail(checkUsername.email);
        }
      }
    }
  } catch (error) {
    console.log('this is my erro in conflict', error);
  }
  return { success: 'success', status: 200 };
};

/**
 * Performs creating user
 * Performs creating verification token
 * Performs email verification send
 * @returns
 */
const creatingUser = async (email: string, username: string, password: string) => {
  try {
    await dbConnect();
    const user = await createUser({ email, username }, password);
    console.log('my user: ', user);
    await createStudentProfile({ userId: user._id });
    if (!user) return { error: 'Error creating User', status: 404 };

    const tokenType = 'Verify';
    const verificationToken = await generateVerificationToken(user._id, tokenType);

    if (!verificationToken) return { error: 'Error creating verificationToken', status: 404 };

    const send = await sendVerificationEmail(verificationToken.email, verificationToken.code, username, 'Confirm your Email');
    if (!send) return { error: 'Error sending verification email', status: 404 };
    return { user: user, token: verificationToken.token };
  } catch (error) {
    console.log(error);
    return { user: null, token: null };
  }
};
