'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import TeacherSchedule from '@/models/TeacherSchedule';
import { getDeanProfileById } from '@/services/deanProfile';
import { getRoomById } from '@/services/room';
import { getSuperAdminProfileByUserId } from '@/services/superAdminProfile';
import { getTeacherProfileById } from '@/services/teacherProfile';
import { getTeacherScheduleById, getAllTeacherScheduleByProfileId, getAllTeacherScheduleByDeanId, getAllTeacherScheduleByScheduleRoomId, archivedTeacherScheduleById } from '@/services/teacherSchedule';
import { checkAuth } from '@/utils/actions/session';
import mongoose from 'mongoose';

/**
 * handles retrieve teacher schedule in college action
 *
 * @param {string} id
 */
export const retrieveTeacherScheduleCollegeAction = async (id: string) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };
    if (session.user?.role !== 'SUPER ADMIN') return { error: 'Forbidden.', status: 403 };

    const p = await getSuperAdminProfileByUserId(session?.user?._id);
    if (!p) return { error: 'Invalid Profile Id.', status: 404 };

    const isValidScheduleIdObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidScheduleIdObjectId) return { error: `Invalid Schedule Id.`, status: 400 };

    const t = await getTeacherScheduleById(id);
    if (!t) return { error: 'Instructor Schedule not found.', status: 404 };

    const a = await checkCategory(t, session?.user);
    if (!a || a.error) return a;

    const updatedTS = await TeacherSchedule.findByIdAndUpdate(id, { archive: false }, { new: true });
    if (!updatedTS) return { error: 'Something went wrong.', status: 500 };

    return { message: 'Teacher Schedule has been retrieved.', category: t?.category, status: 201 };
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
    let teacher;
    let teacherS;
    switch (data.profileId.userId.role) {
      case 'TEACHER':
        teacher = await getTeacherProfileById(data.profileId._id);
        if (!teacher) return { error: 'There is no Instructor found.', status: 404 };
        teacherS = await getAllTeacherScheduleByProfileId(teacher._id);
        break;
      case 'DEAN':
        teacher = await getDeanProfileById(data.deanId._id);
        if (!teacher) return { error: 'There is no Instructor found.', status: 404 };
        teacherS = await getAllTeacherScheduleByDeanId(teacher._id);
        break;
      default:
        return { error: 'Forbidden', status: 400 };
    }

    if (teacherS && teacherS.length > 0) {
      const tsConflict = await checkTeacherScheduleConflict(teacherS, data, teacher);
      if (tsConflict && tsConflict.error) return tsConflict;
    }

    const room = await getRoomById(data.roomId);
    if (!room) return { error: 'There is no Room found.', status: 404 };

    const roomConflict = await checkSchedulesInRooms(data);
    if (roomConflict && roomConflict.error) return roomConflict;

    return { success: true, message: 'Schedule has been added to instructor.', category: data.category, status: 201 };
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
    console.log('scheds', scheds.length);
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

        if (isTimeOverlap) return { error: 'Instructor Schedule might have conflict to retrieve. Please review the instructor schedule.', errorInsLink: `${teacher.userId._id.toString()}`, status: 409 };
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
              error: 'Room Schedule might have conflict if to retrieve. Please review the room schedule.',
              status: 409,
              errorRoomLink: `/${data.roomId}`,
            };
          }
        }
      }
    }
  });
};
