'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getAllAccountingProfile } from '@/services/accountingProfile';
import { getAllAdminProfile } from '@/services/adminProfile';
import { getAllDeanProfile } from '@/services/deanProfile';
import { getAllStudentProfile } from '@/services/studentProfile';
import { getAllSuperAdminProfile } from '@/services/superAdminProfile';
import { getAllTeacherProfile } from '@/services/teacherProfile';
import { checkAuth } from '@/utils/actions/session';

/**
 * only admin roles
 * handles query all users by roles
 *
 * @param {string} role
 */
export const getAllUserByRoleAction = async (role: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };
    // if (session.user.role !== 'ADMIN') return { error: 'Not Authorized.', status: 403 };

    const checkedSearchRole = await checkSearchRole(role);
    if (checkedSearchRole && checkedSearchRole.error) return { error: checkedSearchRole.error, status: checkedSearchRole.status };

    return { profiles: checkedSearchRole.profiles, status: 200 };
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
      case 'ACCOUNTING':
        profiles = await getAllAccountingProfile();
        break;
      case 'SUPER ADMIN':
        profiles = await getAllSuperAdminProfile();
        break;
      default:
        return { error: 'Invalid role', status: 403 };
    }
    return { profiles: JSON.parse(JSON.stringify(profiles)), status: 200 };
  });
};
