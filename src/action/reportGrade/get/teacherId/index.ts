'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getReportGradeByTeacherId } from '@/services/reportGrade';
import { getTeacherProfileByUserId } from '@/services/teacherProfile';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query report grade by teacherId
 *
 * @param {string} teacherId
 */
export const getReportGradeByTeacherIdAction = async (teacherId: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session.user.role !== 'TEACHER') return { error: 'Forbidden', status: 403 };

    const p = await getTeacherProfileByUserId(session.user._id);
    if (teacherId !== p._id.toString()) return { error: 'Forbidden', status: 403 };

    const reportGrades = await getReportGradeByTeacherId(p._id);
    return { reportGrades: JSON.parse(JSON.stringify(reportGrades)), status: 201 };
  });
};
