'use server';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { deleteStudentProfileByUserId } from '@/services/studentProfile';
import { deleteUserByEmail, getUserByEmail } from '@/services/user';

/**
 * Checks if the new email already exists in the database.
 *
 * @param {string} email
 */
export const checkNewEmail = async (email: string) => {
  return tryCatch(async () => {
    const existingEmail = await getUserByEmail(email);

    if (existingEmail) {
      if (existingEmail.emailVerified) {
        return { error: 'Email is already exist.', status: 409 };
      } else {
        await deleteStudentProfileByUserId(existingEmail._id);
        await deleteUserByEmail(existingEmail.email);
      }
    }

    return { success: 'No email conflict.', status: 200 };
  });
};
