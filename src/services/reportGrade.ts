'use server';
import ReportGrade from '@/models/ReportGrade';

export const createTeacherReportGrade = async (data: any) => {
  try {
    const newReportGrade = await ReportGrade.create({
      ...data,
    });
    return newReportGrade;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllTeacherReportGrade = async () => {
  try {
    const rg = await ReportGrade.find()
      .populate('userId')
      .populate('teacherId')
      .populate('teacherScheduleId')
      .populate({
        path: 'teacherScheduleId',
        populate: [{ path: 'profileId' }, { path: 'blockTypeId' }, { path: 'courseId' }, { path: 'roomId' }, { path: 'subjectId' }],
      })
      .populate({
        path: 'reportedGrade.profileId',
        populate: [{ path: 'courseId' }, { path: 'userId' }],
      })
      .exec();
    return rg;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const getTeacherReportGradeById = async (id: any) => {
  try {
    const rg = await ReportGrade.findById(id)
      .populate('userId')
      .populate('teacherId')
      .populate('teacherScheduleId')
      .populate({
        path: 'teacherScheduleId',
        populate: [{ path: 'profileId' }, { path: 'blockTypeId' }, { path: 'courseId' }, { path: 'roomId' }, { path: 'subjectId' }],
      })
      .populate({
        path: 'reportedGrade.profileId',
        populate: [{ path: 'courseId' }, { path: 'userId' }],
      })
      .exec();
    return rg;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const updateTeacherReportGradeStatusById = async (id: any, data: any) => {
  try {
    const newReportGrade = await ReportGrade.findByIdAndUpdate(id, {
      ...data,
    });
    return newReportGrade;
  } catch (error) {
    console.log(error);
    return null;
  }
};
