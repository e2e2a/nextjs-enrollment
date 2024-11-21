'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getStudentCurriculumByCategory } from '@/services/studentCurriculum';
import { checkAuth } from '@/utils/actions/session';

/**
 * handle query student curriculum by category
 *
 * @param {string} category
 */
export const getStudentCurriculumByCategoryAction = async (category: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session.user.role !== 'ADMIN' && session.user.role !== 'DEAN') return { error: 'Forbidden.', status: 403 };

    const p = await getStudentCurriculumByCategory(category);
    return { curriculums: JSON.parse(JSON.stringify(p)), status: 201 };
  });
};
