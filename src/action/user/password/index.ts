'use server';
import { checkAuth } from '@/action/helpers/auth';
import dbConnect from '@/lib/db/db';
import { comparePassword, hashPassword } from '@/lib/hash/bcrypt';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { NewPasswordValidator } from '@/lib/validators/user/password';
import { updateUserById } from '@/services/user';
import { signOut } from 'next-auth/react';

/**
 *
 * Handles New Password change for authenticated users.
 * Any ROLES
 *
 * @param {any} data - The data object.
 * @returns Result of the password change action
 */
export const NewPasswordAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const validatedFields = NewPasswordValidator.safeParse(data);
    if (!validatedFields.success) return { error: 'Invalid fields!', status: 400 };

    const updatedUser = await updateUser(session.user, validatedFields.data.currentPassword!, validatedFields.data.password);
    if (!updatedUser || updatedUser.error) return { error: updatedUser.error, status: 403 };
    await signOut()
    return { message: 'New Password has been set!', status: 200 };
  });
};

/**
 *
 * Compares the current password with the stored password.
 *
 * @param {any} user - The user object.
 * @param {string} currentPassword - The current password to verify.
 * @returns Result of the password check.
 */
const checkPassword = async (user: any, currentPassword: string) => {
  return tryCatch(async () => {
    if (user.password) {
      const isMatch = await comparePassword(currentPassword as string, user.password as string);

      if (!isMatch) return { error: 'Incorrect Current Password.', status: 403 };
      return { success: true, status: 200 };
    }
  });
};

/**
 *
 * Verifies current password and updates the user's password.
 *
 * @param {any} user - The user object.
 * @param {string} currentPassword - The user's current password.
 * @param {string} password - The new password to set.
 * @returns Result of the update user password.
 */
const updateUser = async (user: any, currentPassword: string, password: string) => {
  return tryCatch(async () => {
    const checkedPassword = await checkPassword(user, currentPassword!);
    if (!checkedPassword || checkedPassword.error) return { error: checkedPassword.error, status: 403 };
    const hashedPassword = await hashPassword(password);

    const updateUser = await updateUserById(user._id, hashedPassword);
    if (!updateUser) return { error: 'failed to update the password', status: 403 };
    return { success: true, status: 200 };
  });
};
