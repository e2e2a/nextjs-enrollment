'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getTeacherScheduleById } from '@/services/teacherSchedule';
import { checkAuth } from '@/utils/actions/session';

/**
 * query teacher schedule by id
 *
 * @param {object} data
 */
export const getTeacherScheduleByIdAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();

    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const t = await getTeacherScheduleById(data.id);
    if (t.category !== data.category) return { error: 'Forbidden', status: 500 };

    return { teacherSchedule: JSON.parse(JSON.stringify(t)), status: 200 };
  });
};
