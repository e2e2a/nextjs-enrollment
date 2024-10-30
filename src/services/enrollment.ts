'use server';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';
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

export const getEnrollmentById = async (id: any) => {
  try {
    const e = await Enrollment.findById(id)
      .populate('userId')
      .populate('courseId')
      .populate('profileId')
      .populate('blockTypeId')
      // .populate('studentSubjects.teacherScheduleId')
      .populate({
        path: 'studentSubjects.teacherScheduleId',
        populate: [
          { path: 'profileId' }, // Populate profileId inside teacherScheduleId
          { path: 'courseId' },
          { path: 'subjectId' },
          { path: 'roomId' },
          { path: 'blockTypeId' },
        ],
      })
      .populate({
        path: 'studentSubjects.profileId',
        populate: [
          { path: 'userId' }, // Populate profileId inside teacherScheduleId
        ],
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
    const enrollment = await Enrollment.findOne({ userId })
      .populate('userId')
      .populate('courseId')
      .populate('profileId')
      .populate('blockTypeId')
      .populate({
        path: 'studentSubjects.teacherScheduleId',
        populate: [{ path: 'profileId' }, { path: 'courseId' }, { path: 'subjectId' }, { path: 'roomId' }, { path: 'blockTypeId' }],
      })
      .populate({
        path: 'studentSubjects.profileId',
        populate: [{ path: 'userId' }],
      })
      .exec();
    // console.log('i am exec...', enrollment);
    return enrollment;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getEnrollmentByProfileId = async (profileId: string) => {
  try {
    const enrollment = await Enrollment.findOne({ profileId })
      .populate('userId')
      .populate('courseId')
      .populate('profileId')
      .populate('blockTypeId')
      .populate({
        path: 'studentSubjects.teacherScheduleId',
        populate: [
          { path: 'profileId' }, // Populate profileId inside teacherScheduleId
          { path: 'subjectId' },
          { path: 'courseId' },
          { path: 'roomId' },
          { path: 'blockTypeId' },
        ],
      })
      .populate({
        path: 'studentSubjects.profileId',
        populate: [
          { path: 'userId' }, // Populate profileId inside teacherScheduleId
        ],
      })
      .exec();
    // console.log('i am exec...', enrollment);
    return enrollment;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getEnrollmentQueryStepByCategory = async (data: any) => {
  try {
    const enrollment = await Enrollment.find({ category: data.category, step: data.step })
      .populate('userId')
      .populate('courseId')
      .populate('profileId')
      .populate('blockTypeId')
      .populate({
        path: 'studentSubjects.teacherScheduleId',
        populate: [{ path: 'profileId' }, { path: 'courseId' }, { path: 'subjectId' }, { path: 'roomId' }, { path: 'blockTypeId' }],
      })
      .populate({
        path: 'studentSubjects.profileId',
        populate: [{ path: 'userId' }],
      })
      .exec();
    return enrollment;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllEnrollment = async (category: string) => {
  try {
    const enrollment = await Enrollment.find()
      .populate('userId')
      .populate('courseId')
      .populate('profileId')
      .populate('blockTypeId')
      .populate({
        path: 'studentSubjects.teacherScheduleId',
        populate: [{ path: 'profileId' }, { path: 'courseId' }, { path: 'subjectId' }, { path: 'roomId' }, { path: 'blockTypeId' }],
      })
      .populate({
        path: 'studentSubjects.profileId',
        populate: [{ path: 'userId' }],
      })
      .exec();
    //@ts-ignore
    const filteredEnrollment = enrollment.filter((en) => en.courseId.category === category);
    return filteredEnrollment;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllEnrollmentByTeacherScheduleId = async (teacherScheduleId: any) => {
  try {
    const enrollment = await Enrollment.find({ 'studentSubjects.teacherScheduleId': teacherScheduleId })
      .populate('userId')
      .populate('courseId')
      .populate('profileId')
      .populate('blockTypeId')
      .populate({
        path: 'studentSubjects.teacherScheduleId',
        populate: [{ path: 'profileId' }, { path: 'courseId' }, { path: 'subjectId' }, { path: 'roomId' }, { path: 'blockTypeId' }],
      })
      .populate({
        path: 'studentSubjects.profileId',
        populate: [{ path: 'userId' }],
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
    const e = await Enrollment.findByIdAndUpdate(id, { ...data }, { new: true });
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
