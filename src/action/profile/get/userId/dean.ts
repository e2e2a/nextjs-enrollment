'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { getSingleProfileResponse } from '@/types';
import { getUserById } from '@/services/user';
import { verifyDEAN } from '@/utils/actions/session/roles/dean';

/**
 * only dean roles
 * handles query profile by id
 * 
 * @param {string} id
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
 * @param {string} id
 */
const checkRole = async (id: any) => {
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
