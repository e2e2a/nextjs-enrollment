'use server';
import TeacherScheduleRecord from '@/models/TeacherScheduleRecord';

export const getTeacherScheduleRecordByProfileId = async (profileId: any) => {
  try {
    const TProfile = await TeacherScheduleRecord.find({ profileId }).populate('profileId').exec();
    return TProfile;
  } catch (error) {
    console.log('error in service:', error);
    return null;
  }
};
export const getTeacherScheduleRecordById = async (id: any) => {
  try {
    const TProfile = await TeacherScheduleRecord.findById(id).populate('profileId').exec();
    return TProfile;
  } catch (error) {
    console.log('error in service:', error);
    return null;
  }
};
