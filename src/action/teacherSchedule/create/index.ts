'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { TeacherScheduleCollegeValidator } from '@/lib/validators/teacherSchedule/create/college';
import { getRoomById } from '@/services/room';
import { getTeacherProfileById } from '@/services/teacherProfile';
import { createTeacherSchedule, getAllTeacherScheduleByProfileId, getAllTeacherScheduleByScheduleRoomId } from '@/services/teacherSchedule';
import mongoose from 'mongoose';

export const createTeacherScheduleAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();

    const category = await checkCategory(data);
    if (category && category.error) return category;

    return { message: 'Schedule has been added to instructor.', status: 201 };
  });
};

const checkCategory = async (data: any) => {
  return tryCatch(async () => {
    let a;
    switch (data.category) {
      case 'College':
        a = await handlesCollege(data);
        break;
      default:
        return { error: 'Invalid category.', status: 400 };
    }
    if (a && a.error) return { error: a.error, errorRoomLink: a.errorRoomLink, errorInsLink: a.errorInsLink, status: a.status };
    return { success: true, message: a.message, status: a.status };
  });
};

const handlesCollege = (data: any) => {
  return tryCatch(async () => {
    const isValidTeacherId = mongoose.Types.ObjectId.isValid(data.teacherId);
    const isValidRoomId = mongoose.Types.ObjectId.isValid(data.roomId);
    if (!isValidTeacherId || !isValidRoomId) return { error: `ID ${data.teacherId} is not valid.`, status: 403 };

    const tsParse = TeacherScheduleCollegeValidator.safeParse(data);
    if (!tsParse.success) return { error: 'Invalid fields!', status: 400 };

    const teacher = await getTeacherProfileById(data.teacherId);
    if (!teacher) return { error: 'There is no Teacher found.', status: 404 };

    const room = await getRoomById(data.roomId);
    if (!room) return { error: 'There is no Room found.', status: 404 };

    const teacherS = await getAllTeacherScheduleByProfileId(teacher._id);

    if (teacherS && teacherS.length > 0) {
      const tsConflict = await checkTeacherScheduleConflict(teacherS, data, teacher);
      if (tsConflict && tsConflict.error) return tsConflict;
    }

    const roomConflict = await checkSchedulesInRooms(data);
    if (roomConflict && roomConflict.error) return roomConflict;

    const createdSched = await createTeacherSchedule({ profileId: teacher._id, ...tsParse.data });
    if (!createdSched) return { error: 'Something went wrong.', status: 500 };
    return { message: 'yesyes', success: true, status: 201 };
  });
};

const checkTeacherScheduleConflict = async (scheds: any, data: any, teacher: any) => {
  return tryCatch(async () => {
    if (data.days.length === 0) return { error: 'Please fill the required Days field.', status: 403 };
    const [newStartHours, newStartMinutes] = data.startTime.split(':').map(Number);
    const [newEndHours, newEndMinutes] = data.endTime.split(':').map(Number);

    for (const sched of scheds) {
      const existingDays = sched.days;
      const [existingStartHours, existingStartMinutes] = sched.startTime.split(':').map(Number);
      const [existingEndHours, existingEndMinutes] = sched.endTime.split(':').map(Number);

      // Check time with Days
      const isDayOverlap = data.days.some((day: string) => existingDays.includes(day));
      if (isDayOverlap) {
        const isTimeOverlap =
          (newStartHours < existingEndHours || (newStartHours === existingEndHours && newStartMinutes < existingEndMinutes)) && (newEndHours > existingStartHours || (newEndHours === existingStartHours && newEndMinutes > existingStartMinutes));

        if (isTimeOverlap) return { error: 'Instructor Schedule conflict. Please adjust the times or days.', errorInsLink: `${teacher.userId._id}`, status: 409 };
      }
    }
    return { success: true, message: 'No conflict', status: 200 };
  });
};

const checkSchedulesInRooms = (data: any) => {
  return tryCatch(async () => {
    if (data.days.length === 0) return { error: 'Please fill the required Days field.', status: 403 };
    const [newStartHours, newStartMinutes] = data.startTime.split(':').map(Number);
    const [newEndHours, newEndMinutes] = data.endTime.split(':').map(Number);

    const getRooms = await getAllTeacherScheduleByScheduleRoomId(data.roomId);
    let existingSchedules: { days: string[]; startTime: string; endTime: string }[] = [];

    if (getRooms && getRooms.length > 0) {
      for (const teacherSchedule of getRooms) {
        existingSchedules.push({
          days: teacherSchedule.days,
          startTime: teacherSchedule.startTime,
          endTime: teacherSchedule.endTime,
        });
      }
    }

    if (existingSchedules.length > 0) {
      for (const existingSchedule of existingSchedules) {
        const existingDays = existingSchedule.days;
        const [existingStartHours, existingStartMinutes] = existingSchedule.startTime.split(':').map(Number);
        const [existingEndHours, existingEndMinutes] = existingSchedule.endTime.split(':').map(Number);

        const isDayOverlap = data.days.some((day: string) => existingDays.includes(day));

        if (isDayOverlap) {
          const isTimeOverlap =
            (newStartHours < existingEndHours || (newStartHours === existingEndHours && newStartMinutes < existingEndMinutes)) && (newEndHours > existingStartHours || (newEndHours === existingStartHours && newEndMinutes > existingStartMinutes));

          if (isTimeOverlap) {
            return {
              error: 'Room Schedule conflict. Please adjust the times or days.',
              status: 409,
              errorRoomLink: `/${data.roomId}`,
            };
          }
        }
      }
    }
  });
};
