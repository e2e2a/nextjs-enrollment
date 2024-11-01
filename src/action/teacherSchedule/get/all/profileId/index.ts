'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getAllTeacherScheduleByProfileId } from '@/services/teacherSchedule';
import { checkAuth } from '@/utils/actions/session';

export const getTeacherScheduleByProfileIdAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();

    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const t = await getAllTeacherScheduleByProfileId(data.id);
    return { teacherSchedules: JSON.parse(JSON.stringify(t)), status: 200 };
  });
};
