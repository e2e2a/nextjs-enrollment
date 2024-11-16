'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query Teacher Schedule Record by Category
 *
 * @param {string} category
 */
export const getTeacherScheduleRecordByCategoryAction = async (category: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    // check roles
    // admin/dean
    const tsRecords = await getTeacherScheduleRecordByCategoryAction(category);
    return { teacherScheduleRecords: JSON.parse(JSON.stringify(tsRecords)), status: 200 };
  });
};
