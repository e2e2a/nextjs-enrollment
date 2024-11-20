'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getBlockTypeByCategory } from '@/services/blockType';

/**
 * handles query block type by category
 *
 * @returns
 */
export const getBlockTypeByCategoryAction = async (category: string) => {
  return tryCatch(async () => {
    await dbConnect();

    const blockTypes = await getBlockTypeByCategory(category);
    return { blockTypes: JSON.parse(JSON.stringify(blockTypes)), status: 200 };
  });
};
