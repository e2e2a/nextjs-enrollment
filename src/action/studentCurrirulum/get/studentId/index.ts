'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { getStudentCurriculumByStudentId } from '@/services/studentCurriculum';
import { checkAuth } from '@/utils/actions/session';
import mongoose from 'mongoose';

export const getStudentCurriculumByStudentIdAction = async (studentId: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const a = await checkRole(session.user, studentId);
    return a;
  });
};

const checkRole = async (user: any, studentId: string) => {
  return tryCatch(async () => {
    const isValidObjectId = mongoose.Types.ObjectId.isValid(studentId);
    if (!isValidObjectId) return { error: `Forbidden.`, status: 400 };

    const b = await getStudentCurriculumByStudentId(studentId);
    if (!b) return { error: 'not found', status: 404 };
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
