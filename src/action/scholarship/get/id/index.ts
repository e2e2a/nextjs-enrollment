'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getScholarshipById } from '@/services/scholarship';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query scholarship by id
 *
 * @param {string} id
 */
export const getScholarshipByIdAction = async (id: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };

    const scholarship = await getScholarshipById(id);
    if (!scholarship) return { error: 'Student Scholarship not found.', status: 404 };

    return { scholarship: JSON.parse(JSON.stringify(scholarship)), status: 200 };
  });
};
