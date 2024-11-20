'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getTeacherProfileByUserId } from '@/services/teacherProfile';
import { getTeacherScheduleRecordByProfileId } from '@/services/teacherScheduleRecord';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query Teacher Schedule Record by profile id
 *
 */
export const getTeacherScheduleRecordByProfileIdAction = async () => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session && session.user.role !== 'TEACHER') return { error: 'Forbidden.', status: 403 };

    const p = await getTeacherProfileByUserId(session.user._id);
    const tsRecord = await getTeacherScheduleRecordByProfileId(p._id);
    if (!tsRecord) return { error: 'Not Found.', status: 404 };

    return { teacherScheduleRecord: JSON.parse(JSON.stringify(tsRecord)), status: 200 };
  });
};
