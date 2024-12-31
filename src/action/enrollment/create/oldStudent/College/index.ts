'use server';
import { createEnrollment, getEnrollmentByUserId } from '@/services/enrollment';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import StudentProfile from '@/models/StudentProfile';
import { getEnrollmentRecordByProfileId } from '@/services/enrollmentRecord';
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