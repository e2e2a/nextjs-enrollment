'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { getTeacherScheduleByCategory } from '@/services/teacherSchedule';
import { checkAuth } from '@/utils/actions/session';

/**
 * query teacher schedule by category
 *
 * @param {string} category
 */
export const getTeacherScheduleByCategoryAction = async (category: string) => {
  return tryCatch(async () => {
    await dbConnect();

    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const checkedS = await checkSessionRole(session.user, category);
    if (checkedS && checkedS.error) return { error: checkedS.error, status: checkedS.status };

    return { teacherSchedules: JSON.parse(JSON.stringify(checkedS.ts)), status: 200 };
  });
};

/**
 *
 * @param {object} user
 * @param {string} category
 * @returns
 */
const checkSessionRole = async (user: any, category: string) => {
  return tryCatch(async () => {
    let ts;
    const sched = await getTeacherScheduleByCategory(category);
    switch (user.role) {
      case 'ADMIN':
        ts = sched;
        break;
      case 'DEAN':
        const dean = await getDeanProfileByUserId(user._id);
        // const filteredDean = sched.filter((s: any) => s.courseId && s.courseId._id.toString() === dean.courseId._id.toString());
        // ts = filteredDean;
        ts = sched;
        break;
      case 'STUDENT':
        const stud = await getStudentProfileByUserId(user._id);
        const filteredStud = sched.filter((s: any) => s.courseId && s.courseId._id.toString() === stud.courseId._id.toString());
        ts = filteredStud;
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    return { success: 'yesyes.', ts: ts, status: 403 };
  });
};
