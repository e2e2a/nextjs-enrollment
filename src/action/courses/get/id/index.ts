'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getCoursesById } from '@/services/course';
import { getAllTeacherSchedule } from '@/services/teacherSchedule';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query room by id
 *
 * @param {string} id
 */
export const getCourseByIdAction = async (id: string): Promise<any> => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session.user.role !== 'ADMIN') return { error: 'Not Authorized', status: 401 };
    const course = await getCoursesById(id);
    if (!course) return { error: 'Course not found', status: 404 };

    return { course: JSON.parse(JSON.stringify(course)), status: 201 };
  });
};
