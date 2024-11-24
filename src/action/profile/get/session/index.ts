'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { getSingleProfileResponse } from '@/types';
import { getTeacherProfileByUserId } from '@/services/teacherProfile';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { getAdminProfileByUserId } from '@/services/adminProfile';
import { checkAuth } from '@/utils/actions/session';
import { getAccountingProfileByUserId } from '@/services/accountingProfile';

/**
 * Any authenticated role
 * handles query profile by session id
 *
 */
export const getStudentProfileBySessionIdAction = async (): Promise<getSingleProfileResponse> => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const checkedR = await checkRole(session);
    if (!checkedR.profile || checkedR.error) return { error: 'Profile not found.', status: 404 };

    return { profile: checkedR.profile, status: 200 };
  });
};

/**
 * check roles
 *
 * @param {object} session
 */
const checkRole = async (session: any): Promise<any> => {
  return tryCatch(async () => {
    let profile;
    switch (session.user.role) {
      case 'STUDENT':
        profile = await getStudentProfileByUserId(session.user._id);
        break;
      case 'TEACHER':
        profile = await getTeacherProfileByUserId(session.user._id);
        break;
      case 'DEAN':
        profile = await getDeanProfileByUserId(session.user._id);
        break;
      case 'ADMIN':
        profile = await getAdminProfileByUserId(session.user._id);
        break;
      case 'ACCOUNTING':
        profile = await getAccountingProfileByUserId(session.user._id);
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    return { profile: JSON.parse(JSON.stringify(profile)), status: 200 };
  });
};
