'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { getStudentCurriculumByStudentId } from '@/services/studentCurriculum';
import { getStudentProfileById } from '@/services/studentProfile';
import { checkAuth } from '@/utils/actions/session';
import mongoose from 'mongoose';

/**
 * handle query student curriculum by studentId
 *
 * @param {string} studentId
 */
export const getStudentCurriculumByStudentIdAction = async (studentId: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const a = await checkRole(session.user, studentId);
    return a;
  });
};

/**
 * handle check role
 *
 * @param {object} user
 * @param {string} studentId
 */
const checkRole = async (user: any, studentId: string) => {
  return tryCatch(async () => {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(studentId);
    if (!isValidObjectId) return { error: `not valid.`, status: 400 };

    const a = await getStudentProfileById(studentId);
    if (!a) return { error: 'forbidden', status: 403 };

    const b = await getStudentCurriculumByStudentId(studentId);
    switch (user.role) {
      case 'ADMIN':
        return { curriculums: JSON.parse(JSON.stringify(b)), status: 200 };
      case 'DEAN':
        const p = await getDeanProfileByUserId(user._id);
        if (a.courseId._id.toString() !== p.courseId._id.toString()) return { error: 'Forbidden.', status: 403 };
        const c = b?.filter((e) => e.courseId._id.toString() === p.courseId._id.toString());
        console.log('c', c?.length);
        return { curriculums: JSON.parse(JSON.stringify(c)), status: 200 };
      default:
        return { error: 'Forbidden.', status: 403 };
    }
  });
};
