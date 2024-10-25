'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { User } from '@/models/User';

/**
 * Handles the user sign-Out process.
 *
 * @param {any} data
 */
export const signOutAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    await User.findByIdAndUpdate(data.userId, { $set: { active: false } }, { new: true });
    // cookies.getAll().forEach((cookie) => {
    //   if (cookie.name.includes("next-auth"))
    //     response.cookies.delete(cookie.name);
    // });
    return { message: 'Logged out successfully!', status: 200 };
  });
};
