'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getAllRoomByEduLevel } from '@/services/room';

/**
 * handles query room by Education Level
 *
 * @param {string} level
 */
export const getAllRoomByEduLevelAction = async (level: string) => {
  return tryCatch(async () => {
    await dbConnect();

    const rooms = await getAllRoomByEduLevel(level);

    return { rooms: JSON.parse(JSON.stringify(rooms)), status: 201 };
  });
};
