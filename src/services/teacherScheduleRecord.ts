'use server';
import TeacherScheduleRecord from '@/models/TeacherScheduleRecord';

export const getTeacherScheduleRecordBycategory = async (category: string) => {
  try {
    const TProfile = await TeacherScheduleRecord.find({ category }).populate('profileId').exec();
    return TProfile;
  } catch (error) {
    console.log('error in service:', error);
    return null;
  }
};

export const getTeacherScheduleRecordByProfileId = async (profileId: string) => {
  try {
    const TProfile = await TeacherScheduleRecord.find({ profileId }).populate('profileId').exec();
    return TProfile;
  } catch (error) {
    console.log('error in service:', error);
    return null;
  }
};

export const getTeacherScheduleRecordById = async (id: string) => {
  try {
    const TProfile = await TeacherScheduleRecord.findById(id).populate('profileId').exec();
    return TProfile;
  } catch (error) {
    console.log('error in service:', error);
    return null;
  }
};
