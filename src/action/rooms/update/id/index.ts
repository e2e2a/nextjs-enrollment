'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { RoomValidator } from '@/lib/validators/room/create';
import Room from '@/models/Room';
import { getRoomByName } from '@/services/room';
import { verifyADMIN } from '@/utils/actions/session/roles/admin';
import { Types } from 'mongoose';

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

    const a = await checkeEucationLevel(session.user, data);
    return a;
  });
};

/**
 * check request category level
 *
 * @param {object} user
 * @param {object} data
 */
const checkeEucationLevel = async (user: any, data: any) => {
  return tryCatch(async () => {
    let educationLevel;
    switch (data.educationLevel) {
      case 'tertiary':
        educationLevel = await categoryTertiary(data);
        break;
      default:
        return { error: 'Invalid category.', status: 400 };
    }

    return educationLevel;
  });
};

const categoryTertiary = async (data: any) => {
  return tryCatch(async () => {
    const isValidObjectId = Types.ObjectId.isValid(data.id);
    if (!isValidObjectId) return { error: `Not valid.`, status: 400 };

    const room = await Room.findById(data.id);
    if (!room) return { error: 'Room not found.', status: 404 };

    const roomParse = RoomValidator.safeParse(data);
    if (!roomParse.success) return { error: 'Invalid fields!', status: 400 };

    if (room.roomName.toLowerCase() !== data.roomName.toLowerCase()) {
      const checkRoomConflict = await getRoomByName(data.roomName);
      if (checkRoomConflict) return { error: 'Room name already exists.', status: 403 };
    }

    const updated = await Room.findByIdAndUpdate(data.id, { ...roomParse.data });
    if (!updated) return { error: 'Something went wrong.', status: 500 };
    return { message: 'Room updated successfully.', id: data.id, level: data.educationLevel, status: 201 };
  });
};
