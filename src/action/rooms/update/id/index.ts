'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { RoomValidator } from '@/lib/validators/room/create';
import Room from '@/models/Room';
import { createRoom, getRoomByName } from '@/services/room';
import { verifyADMIN } from '@/utils/actions/session/roles/admin';

/**
 * handles create room
 *
 * @param {Object} data
 */
export const updateRoomByIdAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await verifyADMIN();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };

    const room = await Room.findById(data.id)
    if(!room) return { error: 'Room not found.', status: 404 };

    const roomParse = RoomValidator.safeParse(data);
    if (!roomParse.success) return { error: 'Invalid fields!', status: 400 };
    
    if (room.roomName !== data.roomName){
        const checkRoomConflict = await getRoomByName(data.roomName);
        if (checkRoomConflict) return { error: 'Room name already exists.', status: 403 };
    }

    const createdRoom = await Room.findByIdAndUpdate(data.id, { ...data });
    if (!createdRoom) return { error: 'Something went wrong.', status: 500 };
    return { message: 'Subject updated successfully.', level: data.educationLevel, status: 201 };
  });
};
