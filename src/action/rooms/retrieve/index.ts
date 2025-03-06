'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import Room from '@/models/Room';
import { getRoomById, getRoomByName } from '@/services/room';
import { getSuperAdminProfileByUserId } from '@/services/superAdminProfile';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles retrieve Room in college action
 *
 * @param {Object} id
 */
export const retrieveRoomAction = async (id: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session.user.role !== 'SUPER ADMIN') return { error: 'Forbidden', status: 403 };

    const p = await getSuperAdminProfileByUserId(session?.user?._id);
    if (!p) return { error: 'Profile not found', status: 404 };

    const room = await getRoomById(id);
    if (!room) return { error: 'Room ID is not valid.', status: 404 };

    const checkRoomConflict = await getRoomByName(room.roomName);
    if (checkRoomConflict) return { error: 'Room name already exists.', status: 403 };

    const updated = await Room.findByIdAndUpdate(room._id, { archive: false }, { new: true });
    if (!updated) return { error: 'Something went wrong', status: 500 };
    return { message: `Room has been retrieved.`, id: room?._id.toString(), level: room?.educationLevel, status: 201 };
  });
};
