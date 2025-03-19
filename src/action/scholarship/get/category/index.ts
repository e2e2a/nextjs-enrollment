'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getScholarshipByCategory } from '@/services/scholarship';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query scholarship by category
 *
 * @param {string} category
 */
export const getScholarshipByCategoryAction = async (category: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };

    const scholarships = await getScholarshipByCategory(category);

    return { scholarships: JSON.parse(JSON.stringify(scholarships)), status: 200 };
  });
};
