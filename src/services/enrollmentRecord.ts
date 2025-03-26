'use server';
import EnrollmentRecord from '@/models/EnrollmentRecord';

export const getEnrollmentRecordByCategory = async (category: string) => {
  try {
    const TProfile = await EnrollmentRecord.find({ category })
      .populate({
        path: 'profileId',
        populate: [{ path: 'scholarshipId' }],
      })
      .exec();
    return TProfile;
  } catch (error) {
    console.log('error in service:', error);
    return null;
  }
};
export const getEnrollmentRecordByProfileId = async (profileId: any) => {
  try {
    const TProfile = await EnrollmentRecord.find({ profileId })
      .populate({
        path: 'profileId',
        populate: [{ path: 'scholarshipId' }],
      })
      .exec();
    return TProfile;
  } catch (error) {
    console.log('error in service:', error);
    return null;
  }
};

export const getEnrollmentRecordById = async (id: any) => {
  try {
    const TProfile = await EnrollmentRecord.findById(id)
      .populate({
        path: 'profileId',
        populate: [{ path: 'scholarshipId' }, { path: 'userId' }],
      })
    return TProfile;
  } catch (error) {
    console.log('error in service:', error);
    return null;
  }
};
