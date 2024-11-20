'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getEnrollmentRecordByCategory } from '@/services/enrollmentRecord';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query enrollment by category
 *
 * @param {string} category
 */
export const getEnrollmentRecordByCategoryAction = async (category: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    // check roles
    // admin/dean
    const er = await getEnrollmentRecordByCategory(category);
    return { enrollmentRecords: JSON.parse(JSON.stringify(er)), status: 201 };
  });
};
