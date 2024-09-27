'use server';
import dbConnect from '@/lib/db/db';
import { createRoom, getAllRoom, getRoomById, getRoomByName } from '@/services/room';
import { getRoomResponse } from '@/types';

export const createRoomAction = async (data: any) => {
  try {
    await dbConnect();
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
export const getAllRoomAction = async () => {
  try {
    await dbConnect();
    const rooms = await getAllRoom();
    return { rooms: JSON.parse(JSON.stringify(rooms)), status: 201 };
  } catch (error) {
    return { error: 'Something went wrong', status: 500 };
  }
};

export const getRoomByIdAction = async (id: string): Promise<getRoomResponse> => {
  try {
    await dbConnect();
    const room = await getRoomById(id);
    return { room: JSON.parse(JSON.stringify(room)), status: 201 };
  } catch (error) {
    return { error: 'Something went wrong', status: 500 };
  }
};
