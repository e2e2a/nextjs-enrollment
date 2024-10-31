'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getAllUsers } from '@/services/user';
import { checkAuth } from '@/utils/actions/session';

/**
 * Handles query all users.
 * only admin
 *
 */
export const getAllUsersAction = async (): Promise<any> => {
  return tryCatch(async () => {
    await dbConnect();

    const session = await checkAuth();
    if (!session || session.error || session.user.role !== 'ADMIN') return { error: 'Not authenticated.', status: 403 };

    const users = await getAllUsers();
    return { users: JSON.parse(JSON.stringify(users)), status: 200 };
  });
};
