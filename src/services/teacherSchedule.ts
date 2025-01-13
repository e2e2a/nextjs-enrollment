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

export const getAllTeacherScheduleByScheduleRoomId = async (roomId: any) => {
  try {
    const ts = await TeacherSchedule.find({ roomId: roomId });
    return ts;
  } catch (error) {
    console.log('error e:', error);
    return [];
  }
};

export const getAllTeacherScheduleByProfileId = async (profileId: any) => {
  try {
    const ts = await TeacherSchedule.find({ profileId })
      .populate({ path: 'profileId', populate: [{ path: 'userId' }] })
      .populate('courseId')
      .populate('blockTypeId')
      .populate('subjectId')
      .populate('roomId')
      .exec();
    return ts;
  } catch (error) {
    console.log('error e:', error);
    return [];
  }
};
export const getAllTeacherScheduleByDeanId = async (deanId: any) => {
  try {
    const ts = await TeacherSchedule.find({ deanId })
      .populate({ path: 'deanId', populate: [{ path: 'userId' }] })
      .populate('courseId')
      .populate('blockTypeId')
      .populate('subjectId')
      .populate('roomId')
      .exec();
    return ts;
  } catch (error) {
    console.log('error e:', error);
    return [];
  }
};

export const getAllTeacherSchedule = async () => {
  try {
    const ts = await TeacherSchedule.find().populate('profileId').populate('deanId').populate('courseId').populate('blockTypeId').populate('subjectId').populate('roomId').lean().exec();
    return ts;
  } catch (error) {
    return [];
  }
};

export const getTeacherScheduleByCategory = async (category: string) => {
  try {
    const ts = await TeacherSchedule.find({ category }).populate('profileId').populate('deanId').populate('courseId').populate('blockTypeId').populate('subjectId').populate('roomId').exec();
    return ts;
  } catch (error) {
    return [];
  }
};

export const getTeacherScheduleById = async (id: any) => {
  try {
    const TProfiles = await TeacherSchedule.findById(id).populate('profileId').populate('deanId').populate('deanId').populate('courseId').populate('blockTypeId').populate('subjectId').populate('roomId').exec();
    return TProfiles;
  } catch (error) {
    return null;
  }
};
export const removeTeacherScheduleById = async (id: any) => {
  try {
    const TProfiles = await TeacherSchedule.findByIdAndDelete(id).exec();
    return TProfiles;
  } catch (error) {
    return null;
  }
};
