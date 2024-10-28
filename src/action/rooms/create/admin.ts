"use server"
import dbConnect from '@/lib/db/db';
import { createRoom, getRoomByName } from '@/services/room';

export const createRoomAction = async (data: any) => {
  try {
    await dbConnect();
    //sanitize the data
    const checkRoomConflict = await getRoomByName(data.roomName);
    if (checkRoomConflict) return { error: 'Room name already exists.', status: 403 };
    const createdRoom = await createRoom(data);
    if (!createdRoom) return { error: 'Something went wrong.', status: 500 };
    return { message: 'Subject created successfully.', status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};