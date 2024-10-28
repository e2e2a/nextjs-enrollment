'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getCoursesByCategory } from '@/services/course';

export const getAllCoursesByCategory = async (category: any) => {
  return tryCatch(async () => {
    await dbConnect();

    const courses = await getCoursesByCategory(category);
    
    return { courses: JSON.parse(JSON.stringify(courses)), status: 200 };
  });
};
