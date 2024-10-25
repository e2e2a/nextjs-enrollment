'use server';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { deleteStudentProfileByUserId } from '@/services/studentProfile';
import { deleteUserByEmail, getUserByEmail, getUserByUsername } from '@/services/user';

/**
 * Checks if the new email already exists in the database.
 *
 * @param {string} username
 */
export const checkNewUsername = async (username: string) => {
  return tryCatch(async () => {
    const checkUsername = await getUserByUsername(username);

    if (checkUsername) {
      if (checkUsername.emailVerified) {
        return { error: 'Username already exist. Please provide another username.', status: 409 };
      } else {
        await deleteStudentProfileByUserId(checkUsername._id);
        await deleteUserByEmail(checkUsername.email);
      }
    }

    return { success: 'No username conflict.', status: 200 };
  });
};
