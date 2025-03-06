'use server';
import Enrollment from '@/models/Enrollment';

export const createEnrollment = async (data: any) => {
  try {
    const newE = new Enrollment({
      ...data,
    });
    const e = await newE.save();
    return e;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * @todo
 * 1. always filter it non rejected status
 */
export const getEnrollmentById = async (id: any) => {
  try {
    const e = await Enrollment.findById(id)
      .populate({
        path: 'userId',
        select: '-password',
      })
      .populate('courseId')
      .populate('profileId')
      .populate('blockTypeId')
      .populate({
        path: 'studentSubjects.teacherScheduleId',
        populate: [{ path: 'profileId' }, { path: 'deanId' }, { path: 'courseId' }, { path: 'subjectId' }, { path: 'roomId' }, { path: 'blockTypeId' }],
      })
      .populate({
        path: 'studentSubjects.profileId',
        populate: [{ path: 'userId', select: '-password' }],
      })
      .exec();
    return e;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getEnrollmentByUserId = async (userId: string) => {
  try {
    const enrollment = await Enrollment.findOne({ userId, enrollStatus: { $ne: 'Rejected' } })
      .populate({
        path: 'userId',
        select: '-password',
      })
      .populate('courseId')
      .populate('profileId')
      .populate('blockTypeId')
      .populate({
        path: 'studentSubjects.teacherScheduleId',
        populate: [{ path: 'profileId' }, { path: 'deanId' }, { path: 'courseId' }, { path: 'subjectId' }, { path: 'roomId' }, { path: 'blockTypeId' }],
      })
      .populate({
        path: 'studentSubjects.profileId',
        populate: [{ path: 'userId', select: '-password' }],
      })
      .exec();
    // console.log('i am exec...', enrollment);
    return enrollment;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getEnrollmentByCourseId = async (courseId: string) => {
  try {
    const enrollment = await Enrollment.find({ courseId, enrollStatus: { $ne: 'Rejected' } })
      .populate({
        path: 'userId',
        select: '-password',
      })
      .populate('courseId')
      .populate('profileId')
      .populate('blockTypeId')
      .populate({
        path: 'studentSubjects.teacherScheduleId',
        populate: [{ path: 'profileId' }, { path: 'deanId' }, { path: 'courseId' }, { path: 'subjectId' }, { path: 'roomId' }, { path: 'blockTypeId' }],
      })
      .populate({
        path: 'studentSubjects.profileId',
        populate: [{ path: 'userId', select: '-password' }],
      })
      .exec();
    // console.log('i am exec...', enrollment);
    return enrollment;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getEnrollmentByProfileId = async (profileId: string) => {
  try {
    const enrollment = await Enrollment.findOne({ profileId, enrollStatus: { $ne: 'Rejected' } })
      .populate({
        path: 'userId',
        select: '-password',
      })
      .populate('courseId')
      .populate('profileId')
      .populate('blockTypeId')
      .populate({
        path: 'studentSubjects.teacherScheduleId',
        populate: [{ path: 'profileId' }, { path: 'deanId' }, { path: 'subjectId' }, { path: 'courseId' }, { path: 'roomId' }, { path: 'blockTypeId' }],
      })
      .populate({
        path: 'studentSubjects.profileId',
        populate: [{ path: 'userId', select: '-password' }],
      })
      .exec();
    return enrollment;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getEnrollmentQueryStepByCategory = async (data: any) => {
  try {
    const enrollment = await Enrollment.find({ category: data.category, step: data.step, enrollStatus: { $ne: 'Rejected' } })
      .populate({
        path: 'userId',
        select: '-password',
      })
      .populate('courseId')
      .populate('profileId')
      .populate('blockTypeId')
      .populate({
        path: 'studentSubjects.teacherScheduleId',
        populate: [{ path: 'profileId' }, { path: 'deanId' }, { path: 'courseId' }, { path: 'subjectId' }, { path: 'roomId' }, { path: 'blockTypeId' }],
      })
      .populate({
        path: 'studentSubjects.profileId',
        populate: [{ path: 'userId', select: '-password' }],
      })
      .exec();
    return enrollment;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getEnrollmentByCategory = async (category: string) => {
  try {
    const enrollment = await Enrollment.find({ category, enrollStatus: { $ne: 'Rejected' } })
      .populate({
        path: 'userId',
        select: '-password',
      })
      .populate('courseId')
      .populate({
        path: 'profileId',
        populate: [{ path: 'courseId' }, { path: 'userId', select: '-password' }],
      })
      .populate('blockTypeId')
      .populate({
        path: 'studentSubjects.teacherScheduleId',
        populate: [{ path: 'profileId' }, { path: 'deanId' }, { path: 'courseId' }, { path: 'subjectId' }, { path: 'roomId' }, { path: 'blockTypeId' }],
      })
      .populate({
        path: 'studentSubjects.profileId',
        populate: [{ path: 'userId', select: '-password' }, { path: 'courseId' }],
      })
      .lean()
      .exec();

    const filteredEnrollment = enrollment.filter((en) => en.courseId.category === category);
    return filteredEnrollment;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllEnrollmentByCategory = async (category: string) => {
  try {
    const enrollment = await Enrollment.find({ category })
      .populate({
        path: 'userId',
        select: '-password',
      })
      .populate('courseId')
      .populate({
        path: 'profileId',
        populate: [{ path: 'courseId' }, { path: 'userId', select: '-password' }],
      })
      .populate('blockTypeId')
      .populate({
        path: 'studentSubjects.teacherScheduleId',
        populate: [{ path: 'profileId' }, { path: 'deanId' }, { path: 'courseId' }, { path: 'subjectId' }, { path: 'roomId' }, { path: 'blockTypeId' }],
      })
      .populate({
        path: 'studentSubjects.profileId',
        populate: [{ path: 'userId', select: '-password' }, { path: 'courseId' }],
      })
      .lean()
      .exec();

    const filteredEnrollment = enrollment.filter((en) => en.courseId.category === category);
    return filteredEnrollment;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllEnrollmentByTeacherScheduleId = async (teacherScheduleId: any) => {
  try {
    const enrollment = await Enrollment.find({ enrollStatus: { $ne: 'Rejected' }, 'studentSubjects.teacherScheduleId': teacherScheduleId })
      .populate({
        path: 'userId',
        select: '-password',
      })
      .populate('courseId')
      .populate('profileId')
      .populate('blockTypeId')
      .populate({
        path: 'studentSubjects.teacherScheduleId',
        populate: [{ path: 'profileId' }, { path: 'deanId' }, { path: 'courseId' }, { path: 'subjectId' }, { path: 'roomId' }, { path: 'blockTypeId' }],
      })
      .populate({
        path: 'studentSubjects.profileId',
        populate: [{ path: 'userId', select: '-password' }, { path: 'courseId' }],
      })
      .exec();
    return enrollment;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateEnrollmentById = async (id: any, data: any) => {
  try {
    const e = await Enrollment.findByIdAndUpdate(id, { $set: { ...data } }, { new: true });
    return e;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteEnrollmentById = async (id: any) => {
  try {
    const e = await Enrollment.findByIdAndDelete(id);
    if (!e) return false;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
