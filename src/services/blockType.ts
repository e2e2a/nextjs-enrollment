'use server';
import BlockType from '@/models/BlockType';

export const createBlockType = async (data: any) => {
  try {
    const newB = await BlockType.create({
      ...data,
    });
    return JSON.parse(JSON.stringify(newB));
  } catch (error) {
    return null;
  }
};

export const getAllBlockType = async () => {
  try {
    const p = await BlockType.find()
      .populate('courseId')
      .populate({
        path: 'blockSubjects.teacherScheduleId',
        populate: [{ path: 'profileId' }, { path: 'subjectId' }, { path: 'blockTypeId' }, { path: 'courseId' }],
      })
      .exec();
    return p;
  } catch (error) {
    return [];
  }
};

export const getBlockTypeByCourseId = async (courseId: string) => {
  try {
    const p = await BlockType.find({ courseId })
      .populate('courseId')
      .populate({
        path: 'blockSubjects.teacherScheduleId',
        populate: [{ path: 'profileId' }, { path: 'subjectId' }, { path: 'blockTypeId' }, { path: 'courseId' }],
      })
      .exec();
    return p;
  } catch (error) {
    return [];
  }
};

export const getBlockTypeById = async (id: any) => {
  try {
    const p = await BlockType.findById(id)
      .populate('courseId')
      // .populate('blockSubjects.teacherScheduleId')
      .populate({
        path: 'blockSubjects.teacherScheduleId',
        populate: [{ path: 'profileId' }, { path: 'subjectId' }, { path: 'blockTypeId' }, { path: 'roomId' }, { path: 'courseId' }],
      })
      .exec();
    return p;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getfilterBlockType = async (data: any) => {
  try {
    const { description, ...datas } = data;
    const newB = await BlockType.findOne({ ...datas });
    return newB;
  } catch (error) {
    return [];
  }
};
