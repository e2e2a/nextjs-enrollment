'use server';
import dbConnect from '@/lib/db/db';
import { getRoomById } from '@/services/room';
import { getTeacherProfileById } from '@/services/teacherProfile';
import { createTeacherSchedule, getTeacherScheduleByProfileId, getTeacherScheduleByScheduleRoomId } from '@/services/teacherSchedule';

export const createTeacherScheduleAction = async (data: any) => {
  try {
    await dbConnect();
    console.log('createRoom action', data);
    const teacher = await getTeacherProfileById(data.teacherId);
    if (!teacher) return { error: 'There is no Teacher found.', status: 404 };
    const room = await getRoomById(data.roomId);
    if (!room) return { error: 'There is no Room found.', status: 404 };

    const teacherSchedule = await getTeacherScheduleByProfileId(teacher._id);
    const [newStartHours, newStartMinutes] = data.startTime.split(':').map(Number);
    const [newEndHours, newEndMinutes] = data.endTime.split(':').map(Number);
    
    if (teacherSchedule) {
      //checking conflict in teacher schedule
      for (const schedule of teacherSchedule.schedule) {
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
            return { error: 'Teacher Schedule conflict. Please adjust the times or days.',errorInsLink: `/${teacherSchedule._id}` , status: 409 };
          }
        }
      }
      const getRooms = await getTeacherScheduleByScheduleRoomId(data.roomId);
      let existingSchedules: { days: string[]; startTime: string; endTime: string }[] = [];

      // Collect all existing schedules for the room
      if (getRooms && getRooms.length > 0) {
        for (const teacherSchedule of getRooms) {
          for (const existingSchedule of teacherSchedule.schedule) {
            existingSchedules.push({
              days: existingSchedule.days,
              startTime: existingSchedule.startTime,
              endTime: existingSchedule.endTime,
            });
          }
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
              errorRoomLink: `/${data.roomId}`  
            };
          }
        }
      }
      teacherSchedule.schedule.push({
        // sectionId: data.sectionId,
        subjectId: data.subjectId,
        roomId: data.roomId,
        days: data.days,
        startTime: data.startTime,
        endTime: data.endTime,
      });

      await teacherSchedule.save();
    } else {
      const getRooms = await getTeacherScheduleByScheduleRoomId(data.roomId);
      let existingSchedules: { days: string[]; startTime: string; endTime: string }[] = [];

      // Collect all existing schedules for the room
      if (getRooms && getRooms.length > 0) {
        for (const teacherSchedule of getRooms) {
          for (const existingSchedule of teacherSchedule.schedule) {
            existingSchedules.push({
              days: existingSchedule.days,
              startTime: existingSchedule.startTime,
              endTime: existingSchedule.endTime,
            });
          }
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
              errorRoomLink: `/${data.roomId}` 
              // scheduleId: teacherSchedule._id,
            };
          }
        }
      }
      // create a new teacher schedule
      const createdSched = await createTeacherSchedule({
        profileId: teacher._id,
        category: data.category,
        schedule: [
          {
            sectionId: data.sectionId,
            subjectId: data.subjectId,
            roomId: data.roomId,
            days: data.days,
            startTime: data.startTime,
            endTime: data.endTime,
          },
        ],
      });
      if (!createdSched) return { error: 'Something went wrong.', status: 500 };
    }
    return { message: 'Subject created successfully.', status: 201 };
  } catch (error) {
    console.log('server e :', error);
    return { error: 'Something went wrong', status: 500 };
  }
};

