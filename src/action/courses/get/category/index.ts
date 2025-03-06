'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getAllCoursesByCategory, getCoursesByCategory } from '@/services/course';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query courses by category
 *
 * @param {string} category
 */
export const getCoursesByCategoryAction = async (category: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    let courses = [];
    courses = await getCoursesByCategory(category);
    if (session?.user?.role === 'SUPER ADMIN') courses = await getAllCoursesByCategory(category);

    return { courses: JSON.parse(JSON.stringify(courses)), status: 200 };
  });
};
