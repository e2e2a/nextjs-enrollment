'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { getStudentCurriculumById } from '@/services/studentCurriculum';
import { getStudentProfileById } from '@/services/studentProfile';
import { checkAuth } from '@/utils/actions/session';
import mongoose from 'mongoose';

/**
 * handle query student curriculum by id
 *
 * @param {string} id
 */
export const getStudentCurriculumByIdAction = async (id: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const a = await checkRole(session.user, id);
    return a;
  });
};

/**
 * handle check role
 *
 * @param {object} user
 * @param {string} id
 */
const checkRole = async (user: any, id: string) => {
  return tryCatch(async () => {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) return { error: `not valid.`, status: 400 };

    const b = await getStudentCurriculumById(id);
    if (!b) {
      const a = await getStudentProfileById(id);
      if (!a) return { error: 'forbidden', status: 403 };
      return { error: 'not found', status: 404 };
    }
    switch (user.role) {
      case 'ADMIN':
        return { curriculum: JSON.parse(JSON.stringify(b)), status: 200 };
      case 'DEAN':
        const p = await getDeanProfileByUserId(user._id);
        if (p.courseId._id.toString() !== b.courseId._id.toString()) return { error: 'Forbidden.', status: 403 };
        return { curriculum: JSON.parse(JSON.stringify(b)), status: 200 };
      default:
        return { error: 'Forbidden.', status: 403 };
    }
  });
};
