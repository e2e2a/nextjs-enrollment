'use server';
import dbConnect from '@/lib/db/db';
import { comparePassword } from '@/lib/hash/bcrypt';
import { NewPasswordValidator } from '@/lib/validators/Validator';
import { deleteResetPasswordByEmail } from '@/services/resetPassword';
import { getUserByEmail, updateUserPasswordById } from '@/services/user';

export const NewPassword = async (data: any) => {
  try {
    await dbConnect();
    const { email } = data;
    const validatedFields = NewPasswordValidator.safeParse(data);
    if (!validatedFields.success) {
      return { error: 'Invalid fields!', status: 400 };
    }

    const { currentPassword, password } = validatedFields.data;
    const existingUser = await getUserByEmail(email);
    //
    if (!existingUser || !existingUser.email || !existingUser.emailVerified) {
      return { error: 'Email does not exist!', status: 404 };
    }
    if (existingUser.password) {
      const isMatch = await comparePassword(currentPassword as string, existingUser.password as string);

      if (!isMatch) return { error: 'Incorrect email or password.', status: 403 };
    }
    
    const newData = {
      id: existingUser.id,
      password: password,
    };

    const updateUser = await updateUserPasswordById(newData);
    if (!updateUser) return { error: 'failed to update the password', status: 403 };
    await deleteResetPasswordByEmail(email);
    //
    return { message: 'New Password has been set!', status: 200 };
  } catch (error) {
    console.error('Error processing request:', error);
    return { error: 'Internal server error.', status: 500 };
  }
};
