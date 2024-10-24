'use server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { User } from '@/models/User';

/**
 * Handles the sign-in process using NextAuth credentials.
 * 
 * @param {string} id - The unique identifier of the user.
 * @param {string} email - The email address of the user.
 * @param {string} [password] - The user's password, optional in some cases.
 * 
 * @returns The result object containing either a success message with status or an error message with status.
 * 
 * The function attempts to sign the user in using the 'credentials' provider in NextAuth.
 * If successful, it updates the user's `active` status in the database.
 * In case of an error, it handles specific authentication errors (e.g., invalid credentials)
 * and returns appropriate error messages.
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
