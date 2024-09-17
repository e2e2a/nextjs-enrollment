'use server';
import dbConnect from '@/lib/db/db';
import Enrollment from '@/models/Enrollment';
import TeacherSchedule from '@/models/TeacherSchedule';
import { getEnrollmentById, getEnrollmentByProfileId } from '@/services/enrollment';

export const updateStudentEnrollmentScheduleAction = async (data: any) => {
  try {
    await dbConnect();
    console.log('recieved data in eeee:', data);
    const enrollment = await getEnrollmentById(data.enrollmentId);
    if (!enrollment) return { error: 'Enrollment ID is not valid.', status: 404 };
    for (const item of data.selectedItems) {
      // Find the Teacher Schedule
      const teacherSchedule = await TeacherSchedule.findById(item.teacherScheduleId).populate('blockTypeId');
      if (!teacherSchedule) {
        return { error: `Teacher Schedule ID ${item.teacherScheduleId} is not valid.`, status: 404 };
      }
    }
    const updatedBlock = await updateStudentSched(enrollment._id, data);
    if (!updatedBlock) return { error: 'Something wrong with updating.', status: 404 };
    return { message: 'Subject created successfully.', status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

const updateStudentSched = async (blockTypeId: any, data: any) => {
  try {
    await dbConnect();
    const enrollment = await getEnrollmentById(data.enrollmentId);
    if (!enrollment) return { error: 'Enrollment ID is not valid.', status: 404 };
    for (const item of data.selectedItems) {
      await Enrollment.findByIdAndUpdate(
        blockTypeId,
        // @ts-ignore
        { $addToSet: { studentSubjects: { teacherScheduleId: item.teacherScheduleId, profileId: enrollment.profileId._id } } }, // Add teacherScheduleId to blockSubjects
        { new: true }
      );
    }
    return { message: 'Block subjects updated successfully.', status: 200 };
  } catch (error) {
    console.error('Error updating block subjects:', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const removeStudentScheduleAction = async (data: any) => {
  try {
    await dbConnect();
    console.log('its here', data);
    const enrollment = await getEnrollmentByProfileId(data.profileId);
    if (!enrollment) return { error: 'Enrollment ID is not valid.', status: 404 };

    // Find the Teacher Schedule
    const teacherSchedule = await TeacherSchedule.findById(data.teacherScheduleId).populate('blockTypeId');
    if (!teacherSchedule) {
      return { error: `Teacher Schedule ID is not valid.`, status: 404 };
    }

    await Enrollment.findByIdAndUpdate(enrollment._id, { $pull: { studentSubjects: { teacherScheduleId: teacherSchedule._id, profileId: enrollment.profileId._id } } }, { new: true });
  } catch (error) {
    console.error('Error removing block subjects:', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
