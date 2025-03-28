'use server';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { handleStudentRole } from './roles/student';

export const categoryCollege = async (user: any, data: any) => {
  return tryCatch(async () => {
    let a;
    switch (user.role) {
      case 'STUDENT':
        a = await handleStudentRole(user, data);
        break;
      default:
        return { error: 'Forbidden.', status: 403 };
    }
    return a;
  });
};