'use server';
import { sendVerificationEmail } from '@/lib/mail/mail';
import { RecoveryValidator } from '@/lib/validators/Validator';
import { getUserByEmail } from '@/services/user';
import { generateVerificationToken } from '@/services/token';
import { recoveryResponse } from '@/types';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';

/**
 * Handles query recovery email
 *
 * @param {Object} data
 */
export const emailRecoveryAction = async (data: any): Promise<recoveryResponse> => {
  return tryCatch(async () => {
    await dbConnect();
    const validatedFields = RecoveryValidator.safeParse(data);
    if (!validatedFields.success) return { error: 'Invalid fields!', status: 400 };

    const existingUser = await getUserByEmail(validatedFields.data.email);
    if (!existingUser || !existingUser.emailVerified || !existingUser.password) return { error: 'Email does not exist!', status: 404 };
    
    const verificationToken = await generateVerificationToken(existingUser._id, 'Recovery');
    await sendVerificationEmail(verificationToken.email, verificationToken.code, existingUser.firstname, 'Recovery Activation');

    return { message: 'Confirmation email sent!', token: verificationToken.token, status: 200 };
  });
};
