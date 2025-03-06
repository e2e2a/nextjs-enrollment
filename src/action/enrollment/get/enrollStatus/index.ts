'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getEnrollmentByCategory } from '@/services/enrollment';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query enrollment by category
 * Any authenticated user
 *
 * @param {string} enrollStatus
 */
export const getEnrollmentByEnrollStatusAction = async (enrollStatus: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const enrollments = await getEnrollmentByCategory(enrollStatus); //get by enrollStatus
    return { enrollment: JSON.parse(JSON.stringify(enrollments)), status: 200 };
  });
};
