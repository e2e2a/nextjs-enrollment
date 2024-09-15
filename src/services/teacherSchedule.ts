'use server';
import TeacherSchedule from '@/models/TeacherSchedule';

export const createTeacherSchedule = async (data: any) => {
  try {
    const newProfile = await TeacherSchedule.create({
      ...data,
    });
    return newProfile;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// export const getAllTeacherSchedule = async () => {
//   try {
//     const TProfiles = await TeacherSchedule.find().populate('profileId').populate('schedule.blockTypeId').populate('schedule.subjectId').populate('schedule.roomId').exec();
//     return TProfiles;
//   } catch (error) {
//     return [];
//   }
// };
// export const getTeacherScheduleById = async (id: any) => {
//   try {
//     const TProfile = await TeacherSchedule.findById(id).populate('profileId').populate('schedule.blockTypeId').populate('schedule.subjectId').populate('schedule.roomId').exec();
//     return TProfile;
//   } catch (error) {
//     return null;
//   }
// };
// export const getTeacherScheduleByProfileId = async (profileId: any) => {
//   try {
//     const TProfile = await TeacherSchedule.findOne({ profileId }).populate('profileId').populate('schedule.blockTypeId').populate('schedule.subjectId').populate('schedule.roomId').exec();
//     return TProfile;
//   } catch (error) {
//     return null;
//   }
// };

export const getAllTeacherScheduleByScheduleRoomId = async (roomId: any) => {
  try {
    const TProfile = await TeacherSchedule.find({ 'roomId': roomId });
    return TProfile;
  } catch (error) {
    console.log('error e:', error);
    return [];
  }
};
export const getAllTeacherScheduleByProfileId = async (profileId: any) => {
  try {
    const TProfiles = await TeacherSchedule.find({ profileId }).populate('profileId').populate('blockTypeId').populate('subjectId').populate('roomId').exec();
    return TProfiles;
  } catch (error) {
    console.log('error e:', error);
    return [];
  }
};

export const getAllTeacherSchedule = async () => {
  try {
    const TProfiles = await TeacherSchedule.find().populate('profileId').populate('blockTypeId').populate('subjectId').populate('roomId').exec();
    return TProfiles;
  } catch (error) {
    return [];
  }
};