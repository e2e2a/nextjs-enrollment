'use server';
import EnrollmentRecord from '@/models/EnrollmentRecord';

export const getEnrollmentRecordByCategory = async (category: string) => {
  try {
    const TProfile = await EnrollmentRecord.find({ category }).populate('profileId').exec();
    return TProfile;
  } catch (error) {
    console.log('error in service:', error);
    return null;
  }
};
export const getEnrollmentRecordByProfileId = async (profileId: any) => {
  try {
    const TProfile = await EnrollmentRecord.find({ profileId }).populate('profileId').exec();
    return TProfile;
  } catch (error) {
    console.log('error in service:', error);
    return null;
  }
};

export const getEnrollmentRecordById = async (id: any) => {
  try {
    const TProfile = await EnrollmentRecord.findById(id).populate('profileId').exec();
    return TProfile;
  } catch (error) {
    console.log('error in service:', error);
    return null;
  }
};
