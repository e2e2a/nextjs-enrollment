'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getCurriculumByCourseId } from '@/services/curriculum';

export const getCurriculumByCourseIdAction = async (courseId: string) => {
  return tryCatch(async () => {
    await dbConnect();

    const p = await getCurriculumByCourseId(courseId);
    return { curriculum: JSON.parse(JSON.stringify(p)), status: 201 };
  });
};
