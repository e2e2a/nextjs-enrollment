'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getReportGradeByCategory } from '@/services/reportGrade';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query report grade by category
 *
 * @param {string} category
 */
export const getReportGradeByCategoryAction = async (category: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const reportedGrades = await getReportGradeByCategory(category);

    return { reportedGrades: JSON.parse(JSON.stringify(reportedGrades)), status: 201 };
  });
};
