"use server"

import { tryCatch } from "@/lib/helpers/tryCatch";
import { deleteStudentProfileByUserId } from "@/services/studentProfile";
import { deleteUserByEmail, getUserByEmail } from "@/services/user";

/**
 *
 * Checks if the new email already exists in the database.
 * If it exists and is verified, returns an error.
 * If it exists and is not verified, deletes the existing user profile and email.
 *
 * @param {string} email - The new email address to check against existing users.
 * @returns Result of the new email check with potential success message or error details.
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
  