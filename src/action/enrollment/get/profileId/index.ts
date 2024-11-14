'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getEnrollmentByProfileId } from '@/services/enrollment';
import { checkAuth } from '@/utils/actions/session';
import mongoose from 'mongoose';

/**
 * Only admin and dean
 * handles query enrollment by profile id
 *
 * @param {string} id
 */
export const getEnrollmentByProfileIdAction = async (id: any) => {
  return tryCatch(async () => {
    await dbConnect();
    console.log('running')
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session.user.role !== 'ADMIN' && session.user.role !== 'DEAN') return { error: 'Forbidden.', status: 403 };

    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) return { error: `profileId ID ${id} is not valid.`, status: 404 };

    const enrollment = await getEnrollmentByProfileId(id);
    return { enrollment: JSON.parse(JSON.stringify(enrollment)), status: 200 };
  });
};
