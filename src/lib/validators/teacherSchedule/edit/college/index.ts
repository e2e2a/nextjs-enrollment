import { z } from 'zod';

const isAfter = (startTime: string, endTime: string) => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  if (startHours >= 22 || endHours >= 22 || startHours < 5 || endHours < 5) {
    return false; // Invalid class time
  }

  // No classes allowed during lunch break from 12:00 PM to 1:00 PM
  if ((startHours === 12 && startMinutes >= 0) || (endHours === 12 && endMinutes > 0) || (endHours === 13 && startMinutes === 0)) {
    console.log('here is not a valid class time');
    return false; // Invalid class time during lunch break
  }
  // Check if endTime is after startTime
  if (endHours > startHours) {
    return true;
  } else if (endHours === startHours) {
    return endMinutes > startMinutes;
  }
  return false;
};

export const EditTeacherScheduleCollegeValidator = z
  .object({
    subjectId: z.string().min(1, { message: 'Subject is required...' }),
    roomId: z.string().min(1, { message: 'Room is required...' }),
    days: z
      .array(z.string().min(1, { message: 'Day must be a non-empty string.' }))
      .min(1, { message: 'At least one day must be selected.' })
      .max(7, { message: 'No more than 7 days can be selected.' }), // Adjust as needed
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Start Time must be in HH:MM format.' }),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'End Time must be in HH:MM format.' }),
  })
  .refine(
    (data) => {
      // Use the data object directly to access startTime and endTime
      const { startTime, endTime } = data;
      if (!isAfter(startTime, endTime)) {
        return false;
      }
      return true;
    },
    {
      message: 'End Time must be later than Start Time.',
      path: ['startTime'],
    }
  );
