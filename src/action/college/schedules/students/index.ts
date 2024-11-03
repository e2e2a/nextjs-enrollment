'use server';
import dbConnect from '@/lib/db/db';
import Enrollment from '@/models/Enrollment';
import TeacherSchedule from '@/models/TeacherSchedule';
import { getEnrollmentByProfileId } from '@/services/enrollment';

export const removeStudentScheduleAction = async (data: any) => {
  try {
    await dbConnect();
    const enrollment = await getEnrollmentByProfileId(data.profileId);
    if (!enrollment) return { error: 'Enrollment ID is not valid.', status: 404 };

    // Find the Teacher Schedule
    const teacherSchedule = await TeacherSchedule.findById(data.teacherScheduleId).populate('blockTypeId');
    if (!teacherSchedule) {
      return { error: `Teacher Schedule ID is not valid.`, status: 404 };
    }
    // @ts-ignore
    await Enrollment.findByIdAndUpdate(enrollment._id, { $pull: { studentSubjects: { teacherScheduleId: teacherSchedule._id, profileId: enrollment.profileId._id } } }, { new: true });
  } catch (error) {
    console.error('Error removing block subjects:', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

