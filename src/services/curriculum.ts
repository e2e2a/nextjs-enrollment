'use server';
import Curriculum from '@/models/Curriculum';

export const createCurriculum = async (data: any) => {
  try {
    const newP = new Curriculum({
      ...data,
    });
    const p = await newP.save();
    return p;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getAllCurriculum = async () => {
  try {
    const p = await Curriculum.find().populate('courseId').exec();
    return p;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getCurriculumById = async (id: any) => {
  try {
    const p = await Curriculum.findById(id).populate('courseId').populate('curriculum.subjectsFormat.subjectId').exec();
    return p;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getCurriculumByCourseId = async (courseId: any) => {
  try {
    const p = await Curriculum.findOne({courseId}).populate('courseId').populate('curriculum.subjectsFormat.subjectId').exec();
    return p;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateCurriculumById = async (id: any, data: any) => {
  try {
    const p = await Curriculum.findByIdAndUpdate(id, { ...data }, { new: true });
    return p;
  } catch (error) {
    console.log(error);
    return null;
  }
};
