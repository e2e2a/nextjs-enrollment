'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { getReportGradeByDeanId, getReportGradeByTeacherId } from '@/services/reportGrade';
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

    const a = await checkRole(session.user, teacherId);
    return a;
  });
};

const checkRole = async (user: any, teacherId: string) => {
  return tryCatch(async () => {
    let reportGrades;
    let rp;
    switch (user.role) {
      case 'DEAN':
        const d = await getDeanProfileByUserId(user._id);
        if (d._id.toString() === teacherId) {
          rp = await getReportGradeByDeanId(teacherId);
        } else {
          rp = await getReportGradeByTeacherId(teacherId);
        }
        const isValid = rp.find((r) => r.teacherScheduleId.courseId._id.toString() === d.courseId._id.toString());
        if (!isValid) return { error: 'Forbidden', status: 403 };
        break;
      case 'TEACHER':
        const t = await getTeacherProfileByUserId(user._id);
        if (teacherId !== t._id.toString()) return { error: 'Forbidden', status: 403 };
        rp = await getReportGradeByTeacherId(t._id);
        break;
      case 'ADMIN':
        rp = await getReportGradeByTeacherId(teacherId) || await getReportGradeByDeanId(teacherId);
        break;
      default:
        return { error: 'Forbidden', status: 403 };
    }
    reportGrades = JSON.parse(JSON.stringify(rp));
    return { reportGrades, status: 200 };
  });
};
