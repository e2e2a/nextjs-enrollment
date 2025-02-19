'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getAllTeacherScheduleByDeanId, getAllTeacherScheduleByProfileId } from '@/services/teacherSchedule';
import { checkAuth } from '@/utils/actions/session';

/**
 * query teacher schedule by profile id
 *
 * @param {object} data
 */
export const getTeacherScheduleByProfileIdAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    let t;
    switch (session.user.role) {
      case 'TEACHER':
        t = await getAllTeacherScheduleByProfileId(data.id);
        break;
      case 'DEAN':
        t = await getAllTeacherScheduleByDeanId(data.id);
        if (data.role === 'TEACHER') t = await getAllTeacherScheduleByProfileId(data.id);
        break;
      case 'ADMIN':
        if (data.role === 'TEACHER') t = await getAllTeacherScheduleByProfileId(data.id);
        if (data.role === 'DEAN') t = await getAllTeacherScheduleByDeanId(data.id);
        break;
      default:
        return { error: 'Forbidden', status: 403 };
    }
  
    return { teacherSchedules: JSON.parse(JSON.stringify(t)), status: 200 };
  });
};
