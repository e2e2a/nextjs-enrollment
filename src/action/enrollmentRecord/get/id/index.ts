'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { getEnrollmentRecordById } from '@/services/enrollmentRecord';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query enrollment record by id
 *
 * @param {string} id
 */
export const getEnrollmentRecordByIdAction = async (id: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const a = await checkUserRole(session.user, id);
    return a;
  });
};

const checkUserRole = async (user: any, id: string) => {
  return tryCatch(async () => {
    const er = await getEnrollmentRecordById(id);
    if (!er) return { error: 'Not Found.', status: 404 };
    switch (user.role) {
      case 'STUDENT':
        const studentP = await getStudentProfileByUserId(user._id);
        // @ts-ignore
        if (studentP?._id.toString() !== er?.profileId?._id.toString()) return { error: 'Not Found.', status: 404 };
        break;
      case 'DEAN':
        const deanP = await getDeanProfileByUserId(user._id);
        if (deanP.courseId.courseCode.toLowerCase() !== er.courseCode.toLowerCase()) return { error: 'Not Found.', status: 404 };
        break;
      case 'ADMIN':
        break;
      case 'SUPER ADMIN':
        break;
      case 'ACCOUNTING':
        break;
      default:
        return { error: 'Forbidden', status: 403 };
    }
    return { enrollmentRecord: JSON.parse(JSON.stringify(er)), status: 200 };
  });
};
