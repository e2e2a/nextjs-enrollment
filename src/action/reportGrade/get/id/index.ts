'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { getReportGradeById } from '@/services/reportGrade';
import { getTeacherProfileByUserId } from '@/services/teacherProfile';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query report grade by teacherId
 *
 * @param {string} id
 */
export const getReportGradeByIdAction = async (id: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    const a = await checkRole(session.user, id);

    if (a && a.error) return { error: a.error, status: a.status };

    return { reportedGrades: JSON.parse(JSON.stringify(a.rp)), status: 201 };
  });
};

/**
 * check role
 *
 * @param {object} user
 * @param {string} id
 */
const checkRole = async (user: any, id: any) => {
  return tryCatch(async () => {
    const rp = await getReportGradeById(id);
    if (!rp) return { error: 'Not found.', status: 404 };

    switch (user.role) {
      case 'TEACHER':
        const t = await getTeacherProfileByUserId(user._id);
        if (t._id.toString() !== rp.teacherId._id.toString()) return { error: 'Forbidden', status: 403 };
        break;
      case 'DEAN':
        const p = await getDeanProfileByUserId(user._id);
        if (p.courseId._id.toString() !== rp.teacherScheduleId.courseId._id.toString()) return { error: 'Forbidden', status: 403 };
        break;
      case 'ADMIN':
        if (rp.statusInDean !== 'Approved') return { error: 'Not found', status: 404 };
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    return { success: 'yesyes', rp: rp, status: 200 };
  });
};
