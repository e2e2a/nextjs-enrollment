'use server';
import dbConnect from '@/lib/db/db';
import { createBlockType, getAllBlockType, getfilterBlockType } from '@/services/blockType';
import { getCourseByCourseCode } from '@/services/course';
import { getBlockCourseResponse } from '@/types';

export const createCourseBlockAction = async (data: any) => {
  await dbConnect();
  try {
    const checkC = await getCourseByCourseCode(data.courseCode);
    if (!checkC) return { error: 'Course not found.', status: 404 };
    delete data.courseCode;
    data.courseId = checkC._id;
    console.log('data to ', data);

    //doublcheck if year and semester block is already created
    const p = await getfilterBlockType(data);
    console.log('p', p);
    // const p = await createBlockType(data);
    if (!p) return { error: '', status: 500 };
    return { message: 'Block Type created successfully created', status: 201 };
  } catch (error) {
    return { error: error, status: 500 };
  }
};

export const getAllBlockTypeAction = async (): Promise<getBlockCourseResponse> => {
  try {
    await dbConnect();
    const blockTypes = await getAllBlockType();
    return { blockTypes: JSON.parse(JSON.stringify(blockTypes)), status: 200 };
  } catch (error) {
    return { error: 'Something went wrong.', status: 500 };
  }
};
