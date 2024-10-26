'use server';
import dbConnect from '@/lib/db/db';
import { hashPassword } from '@/lib/hash/bcrypt';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { ResetPasswordValidator } from '@/lib/validators/resetPassword';
import { ResetPassword } from '@/models/ResetPasswords';
import { updateUserById } from '@/services/user';
import { checkRPToken } from '@/utils/actions/resetPasswordToken';

/**
 * Handles Reset Password change.
 *
 * @param {Object} data
 */
export const resetPasswordAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const validatedFields = ResetPasswordValidator.safeParse(data);
    if (!validatedFields.success) return { error: 'Invalid fields!', status: 400 };

    const checkedToken = await checkRPToken(data.token);
    if (checkedToken && checkedToken.error) return { error: 'Invalid Token Request', status: '403' };
    console.log('checkedToken', checkedToken)
    const updatedPassword = await updatePassword(checkedToken.token.userId._id, data.password);
    if (updatedPassword && updatedPassword.error) return { error: 'Invalid Token Request', status: '403' };

    return { message: 'New Password has been set!', status: 201 };
  });
};

/**
 * Handles update user's password.
 *
 * @param {string} id
 * @param {string} password
 */
const updatePassword = async (id: string, password: string) => {
  return tryCatch(async () => {
    const hashedPassword = await hashPassword(password);
    const updateUser = await updateUserById(id, { password: hashedPassword });
    if (!updateUser) return { error: 'failed to update the password', status: 403 };

    await ResetPassword.findOneAndDelete({ userId: updateUser._id });
    return { success: 'yesyes', status: 201 };
  });
};
