'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getCurriculumByCategory } from '@/services/curriculum';

export const getCurriculumByCategoryAction = async (category: string) => {
  return tryCatch(async () => {
    await dbConnect();
    
    const p = await getCurriculumByCategory(category);
    return { curriculums: JSON.parse(JSON.stringify(p)), status: 201 };
  });
};
