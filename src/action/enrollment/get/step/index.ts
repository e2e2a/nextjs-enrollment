'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { getEnrollmentQueryStepByCategory } from '@/services/enrollment';
import { checkAuth } from '@/utils/actions/session';

export const getEnrollmentQueryStepByCategoryAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();

    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session.user.role !== 'ADMIN' && session.user.role !== 'DEAN') return { error: 'Not authenticated.', status: 403 };

    const checkedRole = await checkRole(session.user, data);
    if (checkedRole && checkedRole.error) return { error: checkedRole.error, status: checkedRole.status };

    return { enrollment: JSON.parse(JSON.stringify(checkedRole.enrollments)), status: 200 };
  });
};

const checkRole = async (user: any, data: any) => {
  return tryCatch(async () => {
    let enrollments;
    switch (user.role) {
      case 'ADMIN':
        enrollments = await getEnrollmentQueryStepByCategory(data);
        break;
      case 'DEAN':
        const e = await getEnrollmentQueryStepByCategory(data);
        const p = await getDeanProfileByUserId(user._id);

        // @ts-ignore
        enrollments = e.filter((en) => en.courseId._id.toString() === p.courseId._id.toString());
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    return { success: 'yesyes.', enrollments: enrollments, status: 200 };
  });
};
