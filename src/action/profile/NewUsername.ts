'use server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db/db';
import { UsernameValidator } from '@/lib/validators/Validator';
import { getUserById, getUserByUsername, updateUserById } from '@/services/user';

/**
 * any roles
 * @returns New Username
 *
 */
export const newUsernameAction = async (data: any): Promise<any> => {
  try {
    const session = await auth();
    await dbConnect();
    const user = await getUserById(session?.user.id);

    const validatedFields = UsernameValidator.safeParse(data);
    if (!validatedFields.success) return { error: 'Invalid fields!', status: 400 };

    const { username } = validatedFields.data;
    if (username.toLowerCase() === user.username.toLowerCase()) {
      return { error: 'Username is the same.', status: 400 };
    } else {
      const existingUsername = await getUserByUsername(username);

      if (existingUsername) return { error: 'Username is already exist.', status: 400 };
      const updatedU = await updateUserById(user._id, validatedFields.data);
      if (!updatedU) return { error: 'error updating.', status: 500 };
    }

    return { message: 'Username has been updated.', status: 200 };
  } catch (error) {
    console.log('adminNewUsernameMutationAction', error);
    return { profile: null, status: 500 };
  }
};
