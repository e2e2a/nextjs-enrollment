'use server';
import TeacherSchedule from '@/models/TeacherSchedule';

export const createTeacherSchedule = async (data: any) => {
  try {
    const newProfile = await TeacherSchedule.create({ ...data });
    return newProfile;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const editTeacherScheduleId = async (id: string, data: any) => {
  try {
    const ts = await TeacherSchedule.findByIdAndUpdate(id, data, { new: true });
    return ts;
  } catch (error) {
    console.log('error e:', error);
    return [];
  }
};

export const getAllTeacherScheduleByScheduleRoomId = async (roomId: any) => {
  try {
    const ts = await TeacherSchedule.find({ roomId: roomId, archive: { $ne: true } });
    return ts;
  } catch (error) {
    console.log('error e:', error);
    return [];
  }
};

export const getAllTeacherScheduleByProfileId = async (profileId: any) => {
  try {
    const ts = await TeacherSchedule.find({ profileId, archive: { $ne: true } })
      .populate({ path: 'profileId', populate: [{ path: 'userId', select: '-password' }] })
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
    const ts = await TeacherSchedule.find({ deanId, archive: { $ne: true } })
      .populate({ path: 'deanId', populate: [{ path: 'userId', select: '-password' }] })
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
    const ts = await TeacherSchedule.find({ archive: { $ne: true } })
      .populate({ path: 'profileId', populate: [{ path: 'userId', select: '-password' }] })
      .populate('deanId')
      .populate('courseId')
      .populate('blockTypeId')
      .populate('subjectId')
      .populate('roomId')
      .lean()
      .exec();
    return ts;
  } catch (error) {
    return [];
  }
};

export const getTeacherScheduleByCategory = async (category: string) => {
  try {
    const ts = await TeacherSchedule.find({ category, archive: { $ne: true } })
      .populate({ path: 'profileId', populate: [{ path: 'userId', select: '-password' }] })
      .populate('deanId')
      .populate('courseId')
      .populate('blockTypeId')
      .populate('subjectId')
      .populate('roomId')
      .exec();
    return ts;
  } catch (error) {
    return [];
  }
};

export const getAllTeacherScheduleByCategory = async (category: string) => {
  try {
    const ts = await TeacherSchedule.find({ category })
      .populate({ path: 'profileId', populate: [{ path: 'userId', select: '-password' }] })
      .populate('deanId')
      .populate('courseId')
      .populate('blockTypeId')
      .populate('subjectId')
      .populate('roomId')
      .populate('archiveBy')
      .exec();
    return ts;
  } catch (error) {
    return [];
  }
};

export const getTeacherScheduleById = async (id: any) => {
  try {
    const TProfiles = await TeacherSchedule.findById(id)
      .populate({ path: 'profileId', populate: [{ path: 'userId', select: '-password' }] })
      .populate('deanId')
      .populate('deanId')
      .populate('courseId')
      .populate('blockTypeId')
      .populate('subjectId')
      .populate('roomId')
      .exec();
    return TProfiles;
  } catch (error) {
    return null;
  }
};

export const archivedTeacherScheduleById = async (id: string, data: any) => {
  try {
    const Ts = await TeacherSchedule.findByIdAndUpdate(id, data, { new: true }).exec();
    return Ts;
  } catch (error) {
    return null;
  }
};
