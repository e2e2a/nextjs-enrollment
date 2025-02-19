'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import Subject from '@/models/Subject';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query subject by category
 *
 * @param {string} id
 */
export const getSubjectByIdAction = async (id: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };
    const subject = await Subject.findById(id).populate('courseId');

    switch (session.user.role) {
      case 'ADMIN':
        break;
      case 'DEAN':
        const p = await getDeanProfileByUserId(session.user._id);
        if (p.courseId._id.toString() !== subject.courseId._id.toString()) return { error: 'Subject not found.', status: 404 };
        break;
      default:
        return { error: 'Forbidden', status: 403 };
    }

    return { subject: JSON.parse(JSON.stringify(subject)), status: 201 };
  });
};
