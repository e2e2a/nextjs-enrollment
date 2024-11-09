'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getBlockTypeByCourseId } from '@/services/blockType';

/**
 * only admin roles
 *
 * @returns blocksTypes array
 */
export const getAllBlockTypeByCourseIdAction = async (courseId: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const blockTypes = await getBlockTypeByCourseId(courseId);
    return { blockTypes: JSON.parse(JSON.stringify(blockTypes)), status: 200 };
  });
};
