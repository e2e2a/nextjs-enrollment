'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getEnrollmentRecordByProfileId } from '@/services/enrollmentRecord';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query enrollment record by profile id
 *
 */
export const getEnrollmentRecordByProfileIdAction = async () => {
  return tryCatch(async () => {
    await dbConnect();

    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session.user.role !== 'STUDENT') return { error: 'Forbidden.', status: 403 };

    const p = await getStudentProfileByUserId(session.user._id);
    const er = await getEnrollmentRecordByProfileId(p._id);
    if (!er) return { error: 'Not Found.', status: 404 };

    return { enrollmentRecord: JSON.parse(JSON.stringify(er)), status: 200 };
  });
};
