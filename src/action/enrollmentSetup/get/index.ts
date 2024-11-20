'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getEnrollmentSetupByName } from '@/services/EnrollmentSetup';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query enrollment setup
 *
 */
export const getEnrollmentSetupAction = async () => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const es = await getEnrollmentSetupByName('GODOY');
    if (!es) return { error: 'Not Found.', status: 404 };

    return { enrollmentSetup: JSON.parse(JSON.stringify(es)), status: 200 };
  });
};
