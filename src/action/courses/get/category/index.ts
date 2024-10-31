'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getCoursesByCategory } from '@/services/course';

/**
 * handles query courses by category
 *
 * @param {string} category
 */
export const getAllCoursesByCategory = async (category: string) => {
  return tryCatch(async () => {
    await dbConnect();

    const courses = await getCoursesByCategory(category);

    return { courses: JSON.parse(JSON.stringify(courses)), status: 200 };
  });
};
