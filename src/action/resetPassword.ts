'use server';
import { sendVerificationEmail } from '@/lib/helpers/mail';
import { NewPasswordValidator, RecoveryValidator } from '@/lib/validators/Validator';
import { deleteResetPasswordTokenByEmail } from '@/services/reset-password';
import { getUserByEmail, updateUserPasswordById } from '@/services/user';
import { generateVerificationToken } from '@/services/verification-token';
import { recoveryResponse, resetPasswordResponse } from '@/types';

export const recoveryProcess = async (data: any): Promise<recoveryResponse> => {
  try {
    const validatedFields = RecoveryValidator.safeParse(data);

    if (!validatedFields.success) {
      return { error: 'Invalid fields!', status: 400 };
    }

    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.emailVerified || !existingUser.password) {
      return { error: 'Email does not exist!', status: 404 };
    }

    const tokenType = 'Recovery';
    const verificationToken = await generateVerificationToken(email, tokenType);
    await sendVerificationEmail(verificationToken.email, verificationToken.code, existingUser.firstname, 'Recovery Activation');

    return { message: 'Confirmation email sent!', token: verificationToken.token, status: 200 };
  } catch (error) {
    console.error('Error processing request:', error);
    return { error: 'Internal server error.', status: 500 };
  }
};

export const resetPassword = async (data:any): Promise<resetPasswordResponse> => {
  try {
    const { email } = data;
    const validatedFields = NewPasswordValidator.safeParse(data);
    if (!validatedFields.success) {
      return { error: 'Invalid fields!', status: 400 };
    }
    
    const { password } = validatedFields.data;
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.emailVerified || !existingUser.password) {
      return { error: 'Email does not exist!', status: 404 };
    }
    const newData = {
      id: existingUser.id,
      password: password,
    };
    const updateUser = await updateUserPasswordById(newData);
    if (!updateUser) return { error: 'failed to update the password', status: 403 };
    await deleteResetPasswordTokenByEmail(email);
    return { message: 'New Password has been set!', status: 200 };
  } catch (error) {
    console.error('Error processing request:', error);
    return { error: 'Internal server error.',status: 500 };
  }
};
