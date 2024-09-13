'use server';
import StudentCurriculum from '@/models/StudentCurriculum';

export const createStudentCurriculum = async (data: any) => {
  try {
    const newP = new StudentCurriculum({
      ...data,
    });
    const p = await newP.save();
    return p;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getAllStudentCurriculum = async () => {
  try {
    const p = await StudentCurriculum.find().populate('studentId').populate('courseId').exec();
    return p;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getStudentCurriculumById = async (id: any) => {
  try {
    const p = await StudentCurriculum.findById(id).populate('studentId').populate('courseId').populate('curriculum.subjectsFormat.subjectId').exec();
    return p;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getStudentCurriculumByStudentId = async (studentId: any) => {
  try {
    const p = await StudentCurriculum.findOne({studentId}).populate('studentId').populate('courseId').populate('curriculum.subjectsFormat.subjectId').exec();
    return p;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateCurriculumById = async (id: any, data: any) => {
  try {
    const p = await StudentCurriculum.findByIdAndUpdate(id, { ...data }, { new: true });
    return p;
  } catch (error) {
    console.log(error);
    return null;
  }
};
