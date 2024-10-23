'use server';
import { checkAuth } from '@/action/helpers/auth';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { UsernameValidator } from '@/lib/validators/Validator';
import { getUserByUsername, updateUserById } from '@/services/user';

/**
 *
 * any roles
 * @returns change username action
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
    return { message: 'Username has been updated.', role: session.user.role, id: session.user.id, status: 200 };
  });
};

/**
 *
 * checking username
 * if username is not changed @return error
 * else if username is changed check if its not exist then saved
 * @returns change username action
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
      return { success: 'Username has been updated.', status: 400 };
    }
  });
};
