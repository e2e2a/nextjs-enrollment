'use server';
import dbConnect from '@/lib/db/db';
import { getTeacherProfileById } from '@/services/teacherProfile';
import { getTeacherScheduleById, removeTeacherScheduleById } from '@/services/teacherSchedule';

export const removeTeacherScheduleCollegeMutation = async (data: any) => {
  try {
    await dbConnect();
    const p = await getTeacherProfileById(data.profileId);
    if (!p) return { error: 'Invalid Profile Id.', status: 404 };
    const t = await getTeacherScheduleById(data.teacherScheduleId);
    if (!t) return { error: 'Invalid Schedule Id.', status: 404 };
    const deletedT = await removeTeacherScheduleById(t._id);
    if (!deletedT) return { error: 'Something went wrong.', status: 500 };
    return { message: 'Schedule has been removed.', status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
