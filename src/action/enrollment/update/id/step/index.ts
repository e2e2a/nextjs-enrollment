'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { checkAuth } from '@/utils/actions/session';
import { handlesCollege } from './helpers/college';

/**
 * update Enrollment by id
 * Approved/Rejected/Undo
 *
 * @param {object} data
 */
export const updateEnrollmentStepAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session.user.role !== 'DEAN' && session.user.role !== 'ADMIN') return { error: 'forbidden', status: 403 };

    const checked = await checkEducationCategory(session.user, data);
    // await sendEmailWithPDF(checkE);
    return checked;
  });
};

/**
 *
 * @param {object} user
 * @param {object} data
 */
const checkEducationCategory = async (user: any, data: any) => {
  return tryCatch(async () => {
    let c;
    switch (data.category) {
      case 'College':
        c = await handlesCollege(user, data);
        break;
      case '2':
        // we can add here if there are multiple categories
        break;
      default:
        return { error: 'forbidden.', status: 403 };
    }
    if (!c) return { error: 'forbidden.', status: 403 };

    return c;
  });
};
