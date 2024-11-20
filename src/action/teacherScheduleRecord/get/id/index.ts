'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getTeacherScheduleRecordById } from '@/services/teacherScheduleRecord';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query Teacher Schedule Record by id
 *
 * @param {string} id
 */
export const getTeacherScheduleRecordByIdAction = async (id: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    // check roles
    // teacher/admin/dean
    const tsRecord = await getTeacherScheduleRecordById(id);
    return { teacherScheduleRecord: JSON.parse(JSON.stringify(tsRecord)), status: 200 };
  });
};
