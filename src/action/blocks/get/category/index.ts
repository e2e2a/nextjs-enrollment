'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getAllBlockTypeByCategory, getBlockTypeByCategory } from '@/services/blockType';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query block type by category
 *
 * @returns
 */
export const getBlockTypeByCategoryAction = async (category: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    let blockTypes = [];
    blockTypes = await getBlockTypeByCategory(category);
    if (session?.user?.role) blockTypes = await getAllBlockTypeByCategory(category);

    return { blockTypes: JSON.parse(JSON.stringify(blockTypes)), status: 200 };
  });
};
