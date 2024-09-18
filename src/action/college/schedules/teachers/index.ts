'use server';
import dbConnect from '@/lib/db/db';
import TeacherSchedule from '@/models/TeacherSchedule';
import { getRoomById } from '@/services/room';
import { getSubjecByCourseCode } from '@/services/subject';
import { getAllTeacherProfile, getTeacherProfileById, getTeacherProfileByUserId } from '@/services/teacherProfile';
import { createTeacherSchedule, getAllTeacherSchedule, getAllTeacherScheduleByProfileId, getAllTeacherScheduleByScheduleRoomId, getTeacherScheduleById, removeTeacherScheduleById } from '@/services/teacherSchedule';
// import { createTeacherSchedule, getAllTeacherSchedule, getTeacherScheduleById, getTeacherScheduleByProfileId, getTeacherScheduleByScheduleRoomId } from '@/services/teacherSchedule';
import { getAllTeacherProfileResponse, getAllTeacherScheduleResponse, getTeacherProfileResponse, getTeacherScheduleResponse } from '@/types';

export const createTeacherScheduleAction = async (data: any) => {
  try {
    await dbConnect();
    const teacher = await getTeacherProfileById(data.teacherId);
    if (!teacher) return { error: 'There is no Teacher found.', status: 404 };
    const room = await getRoomById(data.roomId);
    if (!room) return { error: 'There is no Room found.', status: 404 };
    const teacherSchedules = await getAllTeacherScheduleByProfileId(teacher._id);
    console.log('teacherSchedules', teacherSchedules);
    const [newStartHours, newStartMinutes] = data.startTime.split(':').map(Number);
    const [newEndHours, newEndMinutes] = data.endTime.split(':').map(Number);

    if (teacherSchedules && teacherSchedules.length > 0) {
      //checking conflict in teacher schedule
      for (const schedule of teacherSchedules) {
        console.log('my new schedules: ' + schedule);
        const existingDays = schedule.days; // Existing schedule days
        const [existingStartHours, existingStartMinutes] = schedule.startTime.split(':').map(Number);
        const [existingEndHours, existingEndMinutes] = schedule.endTime.split(':').map(Number);
        // Step 4: Check if the new schedule overlaps with any existing schedule
        const isDayOverlap = data.days.some((day: string) => existingDays.includes(day)); // Check if any days overlap
        if (isDayOverlap) {
          const isTimeOverlap =
            (newStartHours < existingEndHours || (newStartHours === existingEndHours && newStartMinutes < existingEndMinutes)) && (newEndHours > existingStartHours || (newEndHours === existingStartHours && newEndMinutes > existingStartMinutes));

          if (isTimeOverlap) {
            // we need to pass the teacherSchedule._id to the frontend and use to see the schedule of the teacher
            // return { error: 'Teacher Schedule conflict. Please adjust the times or days.', errorInsLink: `/${teacherSchedule._id}`, status: 409 };
            return { error: 'Instructor Schedule conflict. Please adjust the times or days.', errorInsLink: `/`, status: 409 };
          }
        }
      }
      const getRooms = await getAllTeacherScheduleByScheduleRoomId(data.roomId);
      console.log('getRooms', getRooms);
      let existingSchedules: { days: string[]; startTime: string; endTime: string }[] = [];

      // Collect all existing schedules for the room
      if (getRooms && getRooms.length > 0) {
        for (const teacherSchedule of getRooms) {
          existingSchedules.push({
            days: teacherSchedule.days,
            startTime: teacherSchedule.startTime,
            endTime: teacherSchedule.endTime,
          });
        }
      }

      // Check for conflicts with collected schedules
      for (const existingSchedule of existingSchedules) {
        const existingDays = existingSchedule.days;
        const [existingStartHours, existingStartMinutes] = existingSchedule.startTime.split(':').map(Number);
        const [existingEndHours, existingEndMinutes] = existingSchedule.endTime.split(':').map(Number);

        // Check if the days overlap
        const isDayOverlap = data.days.some((day: string) => existingDays.includes(day));

        if (isDayOverlap) {
          // Check if the time ranges overlap
          const isTimeOverlap =
            (newStartHours < existingEndHours || (newStartHours === existingEndHours && newStartMinutes < existingEndMinutes)) && (newEndHours > existingStartHours || (newEndHours === existingStartHours && newEndMinutes > existingStartMinutes));

          if (isTimeOverlap) {
            // If there's an overlap, return a conflict response
            return {
              error: 'Room Schedule conflict. Please adjust the times or days.',
              status: 409,
              errorRoomLink: `/${data.roomId}`,
            };
          }
        }
      }

      const newTeacherSchedul = new TeacherSchedule({
        category: 'College',
        profileId: teacher._id,
        subjectId: data.subjectId,
        roomId: data.roomId,
        days: data.days,
        startTime: data.startTime,
        endTime: data.endTime,
      });

      await newTeacherSchedul.save();
    } else {
      const getRooms = await getAllTeacherScheduleByScheduleRoomId(data.roomId);
      let existingSchedules: { days: string[]; startTime: string; endTime: string }[] = [];

      // Collect all existing schedules for the room
      if (getRooms && getRooms.length > 0) {
        for (const teacherSchedule of getRooms) {
          existingSchedules.push({
            days: teacherSchedule.days,
            startTime: teacherSchedule.startTime,
            endTime: teacherSchedule.endTime,
          });
        }
      }

      // Check for conflicts with collected schedules
      for (const existingSchedule of existingSchedules) {
        const existingDays = existingSchedule.days;
        const [existingStartHours, existingStartMinutes] = existingSchedule.startTime.split(':').map(Number);
        const [existingEndHours, existingEndMinutes] = existingSchedule.endTime.split(':').map(Number);

        // Check if the days overlap
        const isDayOverlap = data.days.some((day: string) => existingDays.includes(day));

        if (isDayOverlap) {
          // Check if the time ranges overlap
          const isTimeOverlap =
            (newStartHours < existingEndHours || (newStartHours === existingEndHours && newStartMinutes < existingEndMinutes)) && (newEndHours > existingStartHours || (newEndHours === existingStartHours && newEndMinutes > existingStartMinutes));

          if (isTimeOverlap) {
            // If there's an overlap, return a conflict response
            return {
              error: 'Room Schedule conflict. Please adjust the times or days.',
              status: 409,
              /**
               * @todo
               * pass link to the client where to see the room schedule individual
               */
              errorRoomLink: `/${data.roomId}`,
              // scheduleId: teacherSchedule._id,
            };
          }
        }
      }
      // create a new teacher schedule
      const createdSched = await createTeacherSchedule({
        profileId: teacher._id,
        category: data.category,

        subjectId: data.subjectId,
        roomId: data.roomId,
        days: data.days,
        startTime: data.startTime,
        endTime: data.endTime,
      });
      if (!createdSched) return { error: 'Something went wrong.', status: 500 };
    }
    return { message: 'Schedule has been added to instructor.', status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const getAllTeacherScheduleAction = async (): Promise<getAllTeacherScheduleResponse> => {
  try {
    await dbConnect();
    const subjects = await getAllTeacherSchedule();
    return { teacherSchedules: JSON.parse(JSON.stringify(subjects)), status: 200 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
export const getTeacherScheduleByProfileIdAction = async (id: any): Promise<getAllTeacherScheduleResponse> => {
  try {
    await dbConnect();
    const t = await getAllTeacherScheduleByProfileId(id);
    return { teacherSchedules: JSON.parse(JSON.stringify(t)), status: 200 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const removeTeacherScheduleCollegeMutation = async (data: any) => {
  try {
    await dbConnect();
    const p = await getTeacherProfileById(data.profileId);
    if (!p) return { error: 'Invalid Profile Id.', status: 404 };
    const t = await getTeacherScheduleById(data.teacherScheduleId);
    if (!t) return { error: 'Invalid Schedule Id.', status: 404 };
    const deletedT = await removeTeacherScheduleById(t._id);
    if (!deletedT) return { error: 'Something went wrong.', status: 500 };
    return { message: 'Schedule has been removed.', status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const getTeacherScheduleByIdAction = async (id:string): Promise<getTeacherScheduleResponse> => {
  try {
    await dbConnect();
    const t = await getTeacherScheduleById(id);
    return { teacherSchedule: JSON.parse(JSON.stringify(t)), status: 200 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const getAllTeacherProfileAction = async (): Promise<getAllTeacherProfileResponse> => {
  try {
    await dbConnect();
    const t = await getAllTeacherProfile();
    return { teachers: JSON.parse(JSON.stringify(t)), status: 200 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
export const getTeacherProfileByIdAction = async (id: string): Promise<getTeacherProfileResponse> => {
  try {
    await dbConnect();
    const t = await getTeacherProfileById(id);
    return { teacher: JSON.parse(JSON.stringify(t)), status: 200 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

export const getTeacherProfileByUserIdAction = async (id: string): Promise<getTeacherProfileResponse> => {
  try {
    await dbConnect();
    const t = await getTeacherProfileByUserId(id);
    return { teacher: JSON.parse(JSON.stringify(t)), status: 200 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};
