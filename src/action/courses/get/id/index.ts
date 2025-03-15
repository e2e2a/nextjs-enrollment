'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getCoursesById } from '@/services/course';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query course by id
 *
 * @param {string} id
 */
export const getCourseByIdAction = async (id: string): Promise<any> => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER ADMIN') return { error: 'Not Authorized', status: 401 };

    const course = await getCoursesById(id);
    if (!course) return { error: 'Course not found', status: 404 };

    return { course: JSON.parse(JSON.stringify(course)), status: 201 };
  });
};
