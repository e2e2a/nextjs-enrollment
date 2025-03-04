'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { EditTeacherScheduleCollegeValidator } from '@/lib/validators/teacherSchedule/edit/college';
import { getDeanProfileById, getDeanProfileByUserId } from '@/services/deanProfile';
import { getRoomById } from '@/services/room';
import { getTeacherProfileById } from '@/services/teacherProfile';
import { createTeacherSchedule, editTeacherScheduleId, getAllTeacherScheduleByDeanId, getAllTeacherScheduleByProfileId, getAllTeacherScheduleByScheduleRoomId, getTeacherScheduleById } from '@/services/teacherSchedule';
import { checkAuth } from '@/utils/actions/session';
import mongoose from 'mongoose';

/**
 * handles creation of teacher schedule
 *
 * @param {object} data
 */
export const editTeacherScheduleAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    const category = await checkCategory(data, session?.user);

    return category;
  });
};

/**
 * check category and store new schedule
 *
 * @param {object} data
 */
const checkCategory = async (data: any, user: any) => {
  return tryCatch(async () => {
    let a;
    switch (data.category) {
      case 'College':
        a = await handlesCollege(data, user);
        break;
      default:
        return { error: 'Invalid category.', status: 400 };
    }
    if (a && a.error) return a;
    return { success: true, ...a };
  });
};

/**
 * handles college category and store new schedule
 *
 * @param {object} data
 */
const handlesCollege = (data: any, user: any) => {
  return tryCatch(async () => {
    const isValidTsId = mongoose.Types.ObjectId.isValid(data.tsId);
    const isValidRoomId = mongoose.Types.ObjectId.isValid(data.roomId);
    if (!isValidTsId || !isValidRoomId) return { error: `ID ${data.tsId} is not valid.`, status: 403 };

    const tsParse = EditTeacherScheduleCollegeValidator.safeParse(data);
    if (!tsParse.success) return { error: 'Invalid fields!', status: 400 };
    let teacher;
    let teacherS;
    let editTs;
    editTs = await getTeacherScheduleById(data.tsId);
    switch (data.role) {
      case 'TEACHER':
        teacher = await getTeacherProfileById(editTs?.profileId?._id);
        if (!teacher) return { error: 'There is no Instructor found.', status: 404 };
        teacherS = await getAllTeacherScheduleByProfileId(teacher._id);
        break;
      case 'DEAN':
        teacher = await getDeanProfileById(editTs?.deanId?._id);
        if (!teacher) return { error: 'There is no Instructor found.', status: 404 };
        teacherS = await getAllTeacherScheduleByDeanId(teacher._id);
        break;
      default:
        return { error: 'Forbidden', status: 400 };
    }

    if (editTs.startTime !== data.startTime || editTs.endtTime !== data.endtTime) {
      if (teacherS && teacherS.length > 0) {
        /**
         * Excluded the updated item from the check to validate existing data
         */
        teacherS = teacherS.filter((ts: any) => ts._id.toString() !== editTs._id.toString());
        const tsConflict = await checkTeacherScheduleConflict(teacherS, data, teacher);
        if (tsConflict && tsConflict.error) return tsConflict;
      }
    }

    if (editTs.roomId._id.toString() !== data.roomId.toString()) {
      const room = await getRoomById(data.roomId);
      if (!room) return { error: 'There is no Room found.', status: 404 };

      const roomConflict = await checkSchedulesInRooms(data);
      if (roomConflict && roomConflict.error) return roomConflict;
    }

    const editedSched = await editTeacherScheduleId(editTs._id, tsParse.data);
    if (!editedSched) return { error: 'Something went wrong.', status: 500 };
    return { success: true, message: 'Schedule has been edited.', category: data.category, id: editTs._id.toString(), status: 201 };
  });
};

/**
 * check teacher schedule conflict
 *
 * @param {object} scheds
 * @param {object} data
 * @param {object} teacher
 */
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

        if (isTimeOverlap) return { error: 'Instructor Schedule conflict. Please adjust the times or days.', errorInsLink: `${teacher.userId._id.toString()}`, status: 409 };
      }
    }
    return { success: true, message: 'No conflict', status: 200 };
  });
};

/**
 * check room schedule conflict
 *
 * @param {object} data
 */
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
