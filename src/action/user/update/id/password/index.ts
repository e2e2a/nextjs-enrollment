'use server';
import { checkAuth } from '@/utils/actions/session';
import dbConnect from '@/lib/db/db';
import { hashPassword } from '@/lib/helpers/hash/bcrypt';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { NewPasswordValidator } from '@/lib/validators/user/update/password';
import { getUserById, updateUserById } from '@/services/user';

/**
 * Handles New Password change.
 * only admin
 *
 * @param {Object} data
 */
export const newPasswordActionByAdmin = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER ADMIN') return { error: 'Not authenticated.', status: 403 };

    const validatedFields = NewPasswordValidator.safeParse(data);
    if (!validatedFields.success) return { error: 'Invalid fields!', status: 400 };

    const updatedUser = await updateUserPassword(data.userId, validatedFields.data.password);
    if (!updatedUser || updatedUser.error) return { error: updatedUser.error, status: 403 };

    return { message: 'New Password has been set!', status: 201 };
  });
};

/**
 * Verifies current password and updates the user's password.
 *
 * @param {string} id
 * @param {string} password - The new password to set.
 */
const updateUserPassword = async (id: string, password: string) => {
  return tryCatch(async () => {
    const user = await getUserById(id);
    if (!user) return { error: 'Not found!', status: 404 };

    const hashedPassword = await hashPassword(password);

    const updateUser = await updateUserById(user._id, { password: hashedPassword });
    if (!updateUser) return { error: 'failed to update the password', status: 403 };
    return { success: true, status: 201 };
  });
};
