'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getAllBlockType } from '@/services/blockType';

export const getAllBlockTypeAction = async () => {
  return tryCatch(async () => {
    await dbConnect();
    const blockTypes = await getAllBlockType();
    return { blockTypes: JSON.parse(JSON.stringify(blockTypes)), status: 200 };
  });
};
