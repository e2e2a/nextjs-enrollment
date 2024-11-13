'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { getReportGradeByCategory } from '@/services/reportGrade';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query report grade by category
 *
 * @param {string} category
 */
export const getReportGradeByCategoryAction = async (category: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const a = await checkRole(session.user, category);

    return { reportedGrades: JSON.parse(JSON.stringify(a.reportedGrades)), status: 201 };
  });
};

/**
 * handles query report grade by category
 *
 * @param {string} category
 */
const checkRole = async (user: any, category: string) => {
  return tryCatch(async () => {
    let a;
    switch (user.role) {
      case 'ADMIN':
        a = await getReportGradeByCategory(category);
        break;
      case 'DEAN':
        const p = await getReportGradeByCategory(category);
        const dean = await getDeanProfileByUserId(user._id);
        a = p.filter((r: any) => r.teacherScheduleId.courseId._id.toString() === dean.courseId._id.toString());
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    return { reportedGrades: a, status: 200 };
  });
};
