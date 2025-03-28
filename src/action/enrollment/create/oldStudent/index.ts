'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { checkAuth } from '@/utils/actions/session';
import { categoryCollege } from './College';

/**
 * Creation for old student
 *
 * @param data
 * @returns
 */
export const createEnrollmentForOldStudentByCategoryAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authenticated.', status: 403 };

    let res;
    switch (data.category) {
      case 'College':
        res = await categoryCollege(session.user, data);
        break;
      default:
        return { error: 'Invalid category.', status: 400 };
    }

    return res;
  });
};
