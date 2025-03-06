'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getAllEnrollmentByCategory, getEnrollmentByCategory } from '@/services/enrollment';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query enrollment by category
 * Any authenticated user
 *
 * @param {string} category
 */
export const getEnrollmentByCategoryAction = async (category: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    let enrollments = [];
    enrollments = await getEnrollmentByCategory(category);
    if (session.user.role === 'SUPER ADMIN') enrollments = await getAllEnrollmentByCategory(category);

    return { enrollment: JSON.parse(JSON.stringify(enrollments)), status: 200 };
  });
};
