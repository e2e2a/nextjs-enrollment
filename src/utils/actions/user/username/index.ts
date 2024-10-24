'use server';

import { tryCatch } from '@/lib/helpers/tryCatch';
import { deleteStudentProfileByUserId } from '@/services/studentProfile';
import { deleteUserByEmail, getUserByEmail, getUserByUsername } from '@/services/user';

/**
 *
 * Checks if the new email already exists in the database.
 * If it exists and is verified, returns an error.
 * If it exists and is not verified, deletes the existing user profile and email.
 *
 * @param {string} username - The new email address to check against existing users.
 * @returns Result of the new email check with potential success message or error details.
 */
export const checkNewUsername = async (username: string) => {
  return tryCatch(async () => {
    const checkUsername = await getUserByUsername(username);
    if (checkUsername && checkUsername.emailVerified) return { error: 'Username already exist. Please provide another username.', status: 409 };
    await deleteStudentProfileByUserId(checkUsername._id);
    await deleteUserByEmail(checkUsername.email);

    return { success: 'No username conflict.', status: 200 };
  });
};
