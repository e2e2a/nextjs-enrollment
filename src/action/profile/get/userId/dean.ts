'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { checkAuth } from '../../../../utils/actions/session';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { getSingleProfileResponse } from '@/types';
import { getTeacherProfileByUserId } from '@/services/teacherProfile';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { getAdminProfileByUserId } from '@/services/adminProfile';
import { getUserById } from '@/services/user';
import { verifyDEAN } from '@/utils/actions/session/roles/dean';

/**
 *
 * only admin roles
 * @returns query of profile by session id or userId
 */
export const getProfileByParamsUserIdAction = async (id: string): Promise<getSingleProfileResponse> => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await verifyDEAN();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };

    const checkedR = await checkRole(id);
    if (!checkedR.profile || checkedR.error) return { error: 'Profile not found.', status: 404 };

    return { profile: checkedR.profile, status: 200 };
  });
};

/**
 *
 * check roles
 * @returns profile of the session username action
 */
const checkRole = async (id: any): Promise<any> => {
  return tryCatch(async () => {
    const user = await getUserById(id);
    let profile;
    switch (user.role) {
      case 'STUDENT':
        profile = await getStudentProfileByUserId(user._id);
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    return { profile: JSON.parse(JSON.stringify(profile)), status: 200 };
  });
};
