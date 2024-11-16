'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import {  getEnrollmentRecordById } from '@/services/enrollmentRecord';
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
    // check roles
    // student/dean/admin
    const er = await getEnrollmentRecordById(id);
    if (!er) return { error: 'Not Found.', status: 404 };
    return { enrollmentRecord: JSON.parse(JSON.stringify(er)), status: 201 };
  });
};
