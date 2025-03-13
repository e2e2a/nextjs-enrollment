'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getEnrollmentById } from '@/services/enrollment';
import { checkAuth } from '@/utils/actions/session';
import mongoose from 'mongoose';

/**
 * handles query enrollment by id
 * Only admin and dean
 *
 * @param {string} id
 */
export const getEnrollmentByIdAction = async (id: any) => {
  return tryCatch(async () => {
    await dbConnect();

    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session.user.role === 'STUDENT') return { error: 'Forbidden.', status: 403 };

    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) return { error: `Teacher Schedule ID ${id} is not valid.`, status: 404 };

    const enrollment = await getEnrollmentById(id);
    return { enrollment: JSON.parse(JSON.stringify(enrollment)), status: 200 };
  });
};
