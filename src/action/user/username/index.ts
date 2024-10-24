'use server';
import { checkAuth } from '@/utils/actions/session';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { UsernameValidator } from '@/lib/validators/Validator';
import { getUserByUsername, updateUserById } from '@/services/user';

/**
 * Handles the process of changing a user's username.
 * Any authenticated user can invoke this action.
 *
 * @param {any} data - The data object containing the new username to be validated and processed.
 * @returns Result of the username change action with potential success message, user role, user ID, and status code.
 */
export const newUsernameAction = async (data: any): Promise<any> => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const validatedFields = UsernameValidator.safeParse(data);
    if (!validatedFields.success) return { error: 'Invalid fields!', status: 400 };

    const { username } = validatedFields.data;
    const checked = await checkUsername(session.user, username, validatedFields.data);
    if (checked && checked.error) return { error: checked.error, status: 500 };
    return { message: 'Username has been updated.', role: session.user.role, id: session.user.id, status: 201 };
  });
};

/**
 * 
 * Validates the new username against the current user's username.
 * If the new username is unchanged, returns an error.
 * If it is changed, checks for existence and updates the username.
 *
 * @param {any} user - The user object containing user data.
 * @param {string} username - The new username to check.
 * @param {any} data - The data object containing the new username.
 * @returns Result of the username check with potential success message or error details.
 */
const checkUsername = async (user: any, username: string, data: any) => {
  return tryCatch(async () => {
    if (username.toLowerCase() === user.username.toLowerCase()) {
      return { error: 'Username is the same.', status: 400 };
    } else {
      const existingUsername = await getUserByUsername(username);

      if (existingUsername) return { error: 'Username is already exist.', status: 400 };
      const updatedU = await updateUserById(user._id, data);
      if (!updatedU) return { error: 'error updating.', status: 500 };
      return { success: 'Username has been updated.', status: 201 };
    }
  });
};
