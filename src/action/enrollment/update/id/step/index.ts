'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { checkAuth } from '@/utils/actions/session';
import { categoryCollege } from './helpers/college';

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

    const checked = await checkCategory(session.user, data);
    if (checked && checked.error) return { error: checked.error, status: 403 };
    // await sendEmailWithPDF(checkE);
    return { message: checked.message, prevStep: checked.prevStep, nextStep: checked.nextStep, status: 201 };
  });
};

/**
 *
 * @param {object} user
 * @param {object} data
 */
const checkCategory = async (user: any, data: any) => {
  return tryCatch(async () => {
    let c;
    switch (data.category) {
      case 'College':
        c = await categoryCollege(user, data);
        break;
      case '2':
        // we can add here if there are multiple categories
        break;
      default:
        return { error: 'forbidden.', status: 403 };
    }
    if (c && c.error) return { error: c.error, status: 403 };

    return { success: 'Foribbeden.', message: c.message, prevStep: c.prevStep, nextStep: c.nextStep, status: 200 };
  });
};
