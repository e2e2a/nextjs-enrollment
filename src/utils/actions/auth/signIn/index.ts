'use server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { User } from '@/models/User';

/**
 * Handles the sign-in process using NextAuth credentials.
 * 
 * @param {string} id
 * @param {string} email
 * @param {string} [password]
 * 
 * @returns The result object containing either a success message with status or an error message with status.
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
