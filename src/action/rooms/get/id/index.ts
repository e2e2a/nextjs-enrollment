'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getRoomById } from '@/services/room';
import { getAllTeacherSchedule } from '@/services/teacherSchedule';

export const getRoomByIdAction = async (id: string): Promise<any> => {
  return tryCatch(async () => {
    await dbConnect();
    const room = await getRoomById(id);
    const ts = await getAllTeacherSchedule();
    const filteredTs = ts.filter((t) => t.roomId._id.toString() === room._id.toString()) 
    const roomWithSched = {
      ...room.toObject(),
      schedules: filteredTs,
    }
    return { room: JSON.parse(JSON.stringify(roomWithSched)), status: 201 };
  });
};
