'use server';
import dbConnect from '@/lib/db/db';
import { createBlockType, getAllBlockType, getBlockTypeById, getfilterBlockType } from '@/services/blockType';
import { getCourseByCourseCode } from '@/services/course';
import { getBlockCourseResponse, getSingleBlockCourseResponse } from '@/types';

// export const createCollegeCourseBlockAction = async (data: any) => {
//   await dbConnect();
//   try {
//     const checkC = await getCourseByCourseCode(data.courseCode);
//     if (!checkC) return { error: 'Course not found.', status: 404 };
//     delete data.courseCode;
//     data.courseId = checkC._id;
//     console.log('data to ', data);

//     //doublcheck if year and semester block is already created
//     const checkB = await getfilterBlockType(data);
//     if (checkB.length > 0) return { error: 'Block Type is already exist in the course selected associated year and semester.', status: 500 };
//     const p = await createBlockType(data);
//     if (!p) return { error: 'Something went wrong in creating block.', status: 500 };
//     return { message: 'Block Type created successfully created', status: 201 };
//   } catch (error) {
//     return { error: error, status: 500 };
//   }
// };

// export const getAllBlockTypeAction = async (): Promise<getBlockCourseResponse> => {
//   try {
//     await dbConnect();
//     const blockTypes = await getAllBlockType();
//     return { blockTypes: JSON.parse(JSON.stringify(blockTypes)), status: 200 };
//   } catch (error) {
//     return { error: 'Something went wrong.', status: 500 };
//   }
// };

// export const getBlockTypeByIdAction = async (data: any): Promise<getSingleBlockCourseResponse> => {
//   try {
//     await dbConnect();
//     const blockType = await getBlockTypeById(data);
//     return { blockType: JSON.parse(JSON.stringify(blockType)), status: 200 };
//   } catch (error) {
//     return { error: 'Something went wrong.', status: 500 };
//   }
// };
