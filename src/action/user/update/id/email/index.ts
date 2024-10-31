'use server';
import { checkAuth } from '@/utils/actions/session';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { EmailValidator } from '@/lib/validators/user/update/email';
import { generateVerificationToken } from '@/services/token';
import { checkNewEmail } from '@/utils/actions/user/email';
import { getUserById, updateUserById } from '@/services/user';

/**
 * Handles the process of changing a user's email address.
 * Any authenticated role
 *
 * @param {Object} data
 */
export const newEmailActionByAdmin = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error || session.user.role !== 'ADMIN') return { error: 'Not authenticated.', status: 403 };

    const validatedFields = EmailValidator.safeParse(data);
    if (!validatedFields.success) return { error: 'Invalid fields!', status: 400 };

    const checked = await checkEmail(data.userId, validatedFields.data.email);
    if (checked && checked.error) return { error: checked.error, status: checked.status };

    return { message: 'Verification is on Process.', role: session.user.role, id: session.user.id, status: 200 };
  });
};

/**
 * Validates the new email against the current user's email.
 *
 * @param {string} id
 * @param {string} email
 */
const checkEmail = async (id: string, email: string) => {
  return tryCatch(async () => {
    const user = await getUserById(id);
    if (!user) return { error: 'Not found!', status: 404 };

    if (email.toLowerCase() === user.email.toLowerCase()) {
      return { error: 'Email is the same.', status: 400 };
    } else {
      const checkedNewEmail = await checkNewEmail(email);
      if (checkedNewEmail && checkedNewEmail.error) return { error: checkedNewEmail.error, status: 500 };

      console.log('no error, ready to update: ', user._id, email)

      const updatedUser = await updateUserById(user._id, { email: email });
      if (!updatedUser) return { error: 'Failed to update the email.', status: 403 };

      return { success: 'Email has been updated.', status: 201 };
    }
  });
};
