'use server';
import dbConnect from '@/lib/db/db';
import { getAllRoomByEduLevel } from '@/services/room';

export const getAllRoomByEduLevelAction = async (level: string) => {
  try {
    await dbConnect();
    const rooms = await getAllRoomByEduLevel(level);
    return { rooms: JSON.parse(JSON.stringify(rooms)), status: 201 };
  } catch (error) {
    return { error: 'Something went wrong', status: 500 };
  }
};
