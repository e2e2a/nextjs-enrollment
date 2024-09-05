'use server';
import dbConnect from '@/lib/db/db';
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

/**
 * @todo
 * @returns 
 */
export const getAllBlockType = async () => {
  try {
    const p = await BlockType.find().populate('courseId').exec()
    return p
  } catch (error) {
    return []
  }
}
export const getfilterBlockType = async (data: any) => {
  try {
    // delete data.description
    const { description, ...datas } = data
    console.log(' data filter', datas)
    const newB = await BlockType.find({
      ...datas,
    });
    return newB
  } catch (error) {
    return [];
  }
};
