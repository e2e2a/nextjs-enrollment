'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { getSubjectByCategory } from '@/services/subject';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query subject by category
 *
 * @param {string} category
 */
export const getSubjectByCategoryAction = async (category: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };

    let subjects;
    switch (session.user.role) {
      case 'ADMIN':
        subjects = await getSubjectByCategory(category);
        break;
      case 'DEAN':
        const p = await getDeanProfileByUserId(session.user._id);
        const a = await getSubjectByCategory(category);
        subjects = a.filter((a) => a.courseId && a.courseId._id.toString() === p.courseId._id.toString());
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }

    return { subjects: JSON.parse(JSON.stringify(subjects)), status: 201 };
  });
};
