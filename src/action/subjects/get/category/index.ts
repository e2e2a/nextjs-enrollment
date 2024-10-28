'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getSubjectByCategory } from '@/services/subject';

export const getSubjectByCategoryAction = async (category: string) => {
  return tryCatch(async () => {
    await dbConnect();

    const subjects = await getSubjectByCategory(category);

    return { subjects: JSON.parse(JSON.stringify(subjects)), status: 201 };
  });
};
