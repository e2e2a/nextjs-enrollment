'use server';
import { checkAuth } from '@/utils/actions/session';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getUserByUsername, updateUserById } from '@/services/user';
import { UsernameValidator } from '@/lib/validators/user/username';

/**
 * Handles the process of changing a user's username.
 * Any authenticated role
 *
 * @param {Object} data
 */
export const newUsernameAction = async (data: any): Promise<any> => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const validatedFields = UsernameValidator.safeParse(data);
    if (!validatedFields.success) return { error: 'Invalid fields!', status: 400 };

    const checked = await checkUsername(session.user, validatedFields.data);
    if (checked && checked.error) return { error: checked.error, status: 500 };
    return { message: 'Username has been updated.', role: session.user.role, id: session.user.id, status: 201 };
  });
};

/**
 *
 * check new username against the current user's username.
 *
 * @param {Object} user
 * @param {any} data
 */
const checkUsername = async (user: any, data: any) => {
  return tryCatch(async () => {
    if (data.username.toLowerCase() === user.username.toLowerCase()) {
      return { error: 'Username is the same.', status: 400 };
    } else {
      const existingUsername = await getUserByUsername(data.username);

      if (existingUsername) return { error: 'Username is already exist.', status: 400 };
      const updatedU = await updateUserById(user._id, data);
      if (!updatedU) return { error: 'error updating.', status: 500 };
      return { success: 'Username has been updated.', status: 201 };
    }
  });
};
