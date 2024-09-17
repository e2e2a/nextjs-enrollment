'use server';
import StudentSchedule from '@/models/StudentSchedule';

export const createStudentSchedule = async (data: any) => {
  try {
    const newProfile = await StudentSchedule.create({
      ...data,
    });
    return newProfile;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getStudentScheduleByStudentId = async (studentId: any) => {
  try {
    const sc = await StudentSchedule.find({ studentId }).populate('studentId').populate('enrollmentId').populate('teacherScheduleId').exec();
    return sc;
  } catch (error) {
    console.log(error);
    return null;
  }
};
