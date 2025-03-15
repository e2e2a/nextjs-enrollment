'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import Room from '@/models/Room';
import TeacherSchedule from '@/models/TeacherSchedule';
import { getRoomById } from '@/services/room';
import { getSuperAdminProfileByUserId } from '@/services/superAdminProfile';
import { checkAuth } from '@/utils/actions/session';

/**
 * handles archived Room in college action
 *
 * @param {Object} data
 */
export const archiveRoomAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session.user.role !== 'SUPER ADMIN') return { error: 'Forbidden', status: 403 };

    const p = await getSuperAdminProfileByUserId(session?.user?._id);
    if (!p) return { error: 'Super Admin Profile not found', status: 404 };

    const room = await getRoomById(data.roomId);
    if (!room) return { error: 'Room ID is not valid.', status: 404 };

    const teacherSchedules = await TeacherSchedule.find().populate('roomId');

    if (teacherSchedules.length > 0) {
      const hasStudentTakenSchedule = teacherSchedules.some((ts) => ts.roomId._id.toString() === room._id.toString());
      if (hasStudentTakenSchedule) return { error: 'Room must not used in Instructor Schedule to archive.', status: 409 };
    }

    const updated = await Room.findByIdAndUpdate(room._id, { archive: true, archiveBy: p?._id }, { new: true });
    if (!updated) return { error: 'Something went wrong', status: 500 };
    return { message: `Room has been archived.`, id: room?._id.toString(), level: room?.educationLevel, status: 201 };
  });
};
