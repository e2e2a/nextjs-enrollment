'use server';
import ReportGrade from '@/models/ReportGrade';

export const createReportGrade = async (data: any) => {
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

export const getReportGradeByCategory = async (category: string) => {
  try {
    const rg = await ReportGrade.find({ category, statusInDean: { $ne: 'Rejected' }, isTrash: { $ne: true } })
      .populate('userId')
      .populate('teacherId')
      .populate('deanId')
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

export const getReportGradeByTeacherId = async (teacherId: string) => {
  try {
    const rg = await ReportGrade.find({ teacherId, statusInDean: { $ne: 'Rejected' }, isTrash: { $ne: true } })
      .populate('userId')
      .populate('teacherId')
      .populate('deanId')
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

export const getReportGradeByDeanId = async (deanId: string) => {
  try {
    const rg = await ReportGrade.find({ deanId, statusInDean: { $ne: 'Rejected' }, isTrash: { $ne: true } })
      .populate('userId')
      .populate('deanId')
      .populate('teacherScheduleId')
      .populate({
        path: 'teacherScheduleId',
        populate: [{ path: 'deanId' }, { path: 'blockTypeId' }, { path: 'courseId' }, { path: 'roomId' }, { path: 'subjectId' }],
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

export const getReportGradeById = async (id: any) => {
  try {
    const rg = await ReportGrade.findById(id)
      .populate('userId')
      .populate('teacherId')
      .populate('deanId')
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
    const newReportGrade = await ReportGrade.findByIdAndUpdate(
      id,
      {
        ...data,
      },
      { new: true }
    );
    return newReportGrade;
  } catch (error) {
    console.log(error);
    return null;
  }
};
