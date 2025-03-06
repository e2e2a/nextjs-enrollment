'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getAllRoomByEduLevel, getRoomByEduLevel } from '@/services/room';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles query room by Education Level
 *
 * @param {string} level
 */
export const getAllRoomByEduLevelAction = async (level: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    let rooms = [];
    rooms = await getRoomByEduLevel(level);
    if (session?.user?.role === 'SUPER ADMIN') rooms = await getAllRoomByEduLevel(level);

    return { rooms: JSON.parse(JSON.stringify(rooms)), status: 201 };
  });
};
