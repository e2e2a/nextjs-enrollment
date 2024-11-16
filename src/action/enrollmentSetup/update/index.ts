'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { updateEnrollmentSetupByName } from '@/services/EnrollmentSetup';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query update enrollment setup
 *
 */
export const updateEnrollmentSetupAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session.user.role !== 'ADMIN') return { error: 'Forbidden.', status: 403 };

    if (data.name !== 'GODOY') return { error: 'is not valid.', status: 500 };
    await updateEnrollmentSetupByName('GODOY', data);

    return { message: 'Success', status: 201 };
  });
};
