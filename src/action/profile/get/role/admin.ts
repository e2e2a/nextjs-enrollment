'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getAllAdminProfile } from '@/services/adminProfile';
import { getAllDeanProfile } from '@/services/deanProfile';
import { getAllStudentProfile } from '@/services/studentProfile';
import { getAllTeacherProfile } from '@/services/teacherProfile';
import { verifyADMIN } from '@/utils/actions/session/roles/admin';

/**
 * only admin roles
 * handles query all users by roles
 *
 * @param {string} role
 */
export const getAllUserByRoleAction = async (role: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await verifyADMIN();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };

    const checkedSearchRole = await checkSearchRole(role);
    if (checkedSearchRole && checkedSearchRole.error) return { error: checkedSearchRole.error, status: checkedSearchRole.status };

    return { profiles: JSON.parse(JSON.stringify(checkedSearchRole.profiles)), status: 200 };
  });
};

/**
 * Check search role
 *
 * @param {string} role
 */
const checkSearchRole = async (role: string) => {
  return tryCatch(async () => {
    let profiles;
    switch (role) {
      case 'ADMIN':
        profiles = await getAllAdminProfile();
        break;
      case 'DEAN':
        profiles = await getAllDeanProfile();
        break;
      case 'STUDENT':
        profiles = await getAllStudentProfile();
        break;
      case 'TEACHER':
        profiles = await getAllTeacherProfile();
        break;
      default:
        return { error: 'Invalid role', status: 403 };
    }
    return { profiles: JSON.parse(JSON.stringify(profiles)), status: 200 };
  });
};
