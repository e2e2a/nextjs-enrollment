'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { getSingleProfileResponse } from '@/types';
import { getTeacherProfileByUserId } from '@/services/teacherProfile';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { getAdminProfileByUserId } from '@/services/adminProfile';
import { getUserById } from '@/services/user';
import { checkAuth } from '@/utils/actions/session';
import { getAccountingProfileByUserId } from '@/services/accountingProfile';

/**
 * only admin roles
 * handles query profile by id
 *
 * @param {string} id
 */
export const getProfileByParamsUserIdAction = async (id: string): Promise<getSingleProfileResponse> => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };
    if (session && session.user.role !== 'ADMIN' && session.user.role !== 'DEAN') return { error: 'Forbidden.', status: 403 };

    const checkedR = await checkSeachRole(session.user, id);
    if (!checkedR.profile || checkedR.error) return { error: checkedR.error, status: 404 };
    return { profile: checkedR.profile, status: 200 };
  });
};

/**
 *
 * check roles
 * @param {string} id
 */
const checkSeachRole = async (user: any, id: any) => {
  return tryCatch(async () => {
    const u = await getUserById(id);
    if (user.role === 'DEAN' && u.role !== 'STUDENT') return { error: 'Dont have permission.', status: 403 };
    let profile;
    switch (u.role) {
      case 'STUDENT':
        profile = await getStudentProfileByUserId(u._id);

        if (user.role === 'DEAN') {
          const d = await getDeanProfileByUserId(user._id);
          if (d.courseId._id.toString() !== profile.courseId._id.toString()) return { error: 'Dont have permission.', status: 403 };
        }

        break;
      case 'TEACHER':
        profile = await getTeacherProfileByUserId(u._id);
        break;
      case 'DEAN':
        profile = await getDeanProfileByUserId(u._id);
        break;
      case 'ADMIN':
        profile = await getAdminProfileByUserId(u._id);
        break;
      case 'ACCOUNTING':
        profile = await getAccountingProfileByUserId(u._id);
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    return { profile: JSON.parse(JSON.stringify(profile)), status: 200 };
  });
};
