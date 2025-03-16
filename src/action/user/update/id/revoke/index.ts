'use server';
import { checkAuth } from '@/utils/actions/session';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getUserById } from '@/services/user';
import { User } from '@/models/User';

/**
 * Handles the process of revoking a user.
 * only super admin
 *
 * @param {any} data
 */
export const revokeUserAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error || session.user.role !== 'SUPER ADMIN') return { error: 'Not authenticated.', status: 403 };

    // const validatedFields = EmailValidator.safeParse(data);
    // if (!validatedFields.success) return { error: 'Invalid fields!', status: 400 };

    const user = await getUserById(data.id);
    if (!user) return { error: 'User Not Found.', status: 404 };

    const updated = await User.findByIdAndUpdate(data.id, { revoke: data.revoke }, { new: true });
    if (!updated) return { error: 'User Not Found.', status: 404 };

    return { message: `User ${user.username || user.email} is successfuly ${data.revoke ? 'revoked' : 'restored'}.`, role: user.role, id: user.id, status: 201 };
  });
};
