'use server';
import { checkAuth } from '@/utils/actions/session';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { EmailValidator } from '@/lib/validators/user/email';
import { generateVerificationToken } from '@/services/token';
import { checkNewEmail } from '@/utils/actions/user/email';

/**
 *
 * Handles the process of changing a user's email address.
 * Any authenticated user can invoke this action.
 *
 * @param {any} data - The data object containing the new email to be validated and processed.
 * @returns Result of the email change action with potential success message, verification token, user role, and status code.
 */
export const newEmailAction = async (data: any): Promise<any> => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const validatedFields = EmailValidator.safeParse(data);
    if (!validatedFields.success) return { error: 'Invalid fields!', status: 400 };

    const checked = await checkEmail(session.user, validatedFields.data.email);
    if (checked && checked.error) return { error: checked.error, status: checked.status };

    return { message: 'Verification is on Process.', token: JSON.parse(JSON.stringify(checked.token)), role: session.user.role, id: session.user.id, status: 200 };
  });
};

/**
 *
 * Validates the new email against the current user's email.
 * If the new email is unchanged, returns an error.
 * If it is changed, checks for existence and generates a verification token.
 *
 * @param {any} user - The user object containing user data.
 * @param {string} email - The new email address to check.
 * @returns Result of the email check with potential success message, verification token, or error details.
 */
const checkEmail = async (user: any, email: string) => {
  return tryCatch(async () => {
    if (email.toLowerCase() === user.email.toLowerCase()) {
      return { error: 'Email is the same.', status: 400 };
    } else {
      const checkedNewEmail = await checkNewEmail(email);
      if (checkedNewEmail && checkedNewEmail.error) return { error: checkedNewEmail.error, status: 500 };
      const verificationToken = await generateVerificationToken(user._id, 'ChangeEmail', email);
      if (!verificationToken) return { error: 'Error creating verificationToken', status: 404 };

      return { success: 'Email has been updated.', token: verificationToken, status: 201 };
    }
  });
};
