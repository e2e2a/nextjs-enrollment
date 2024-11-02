import { z } from 'zod';
import { parse, isValid, isBefore, differenceInYears } from 'date-fns';
const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Adjust if the birthday hasn't occurred yet this year
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    // return age - 1;
  }
  return age;
};
const nameRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+[-'s]?[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/;

export const StudentProfileValidator = z
  .object({
    // firstname: z.string().min(2, { message: 'Firstname must atleast 2 characters...' }),
    email: z.string().email({ message: 'Email is Required...' }),
    username: z.string().min(1, { message: 'Middlename must atleast 2 characters...' }),
    firstname: z
      .string()
      .min(2, 'Name should have at least 2 characters')
      .refine((value) => nameRegex.test(value ?? ''), { message: 'Name should only contain valid alphabets...' }),
    middlename: z.string().min(1, { message: 'Middlename must atleast 2 characters...' }),
    lastname: z.string().min(2, { message: 'Lastname must atleast 2 characters...' }),
    //extension name added
    extensionName: z.string().optional(),
    numberStreet: z.string().min(1, { message: 'Number,Street is required...' }),
    barangay: z.string().min(1, { message: 'Barangay is required...' }),
    district: z.string().min(1, { message: 'District is required...' }),
    cityMunicipality: z.string().min(1, { message: 'City/Municipality is required...' }),
    province: z.string().min(1, { message: 'Province is required...' }),
    region: z.string().min(1, { message: 'Region is required...' }),
    emailFbAcc: z.string().optional(),
    contact: z.string().min(6, { message: 'contact is required...' }),
    nationality: z.string().min(1, { message: 'Nationality is required...' }),
    sex: z.string().min(1, { message: 'Sex is required...' }),
    civilStatus: z.string().min(1, { message: 'Civil Status is required...' }),
    employmentStatus: z.string().min(1, { message: 'Employment Status is required...' }),
    birthday: z.date({ required_error: 'Provide a valid date...' }).refine(
      (date) => {
        // const isNotInFuture = date <= new Date();
        const isAtLeast14YearsOld = calculateAge(date) >= 14;
        return isAtLeast14YearsOld;
      },
      {
        message: 'You must be at least 14 years old.',
      }
    ),
    age: z.number().optional(),
    birthPlaceCity: z.string().min(6, { message: 'City/Municipality is required...' }),
    birthPlaceProvince: z.string().min(6, { message: 'Province is required...' }),
    birthPlaceRegion: z.string().min(6, { message: 'Region is required...' }),
    educationAttainment: z.string().min(6, { message: 'Education Attainment is required.' }),
    learnerOrTraineeOrStudentClassification: z.string().min(1, { message: 'Classification is required...' }),
    password: z.string().min(6, { message: 'Password must atleast 6 characters.' }),
    CPassword: z.string(),
  })
  .refine((data) => data.password === data.CPassword, {
    message: "Confirmation password doesn't match!",
    path: ['CPassword'],
  })
  .transform((data) => {
    return {
      ...data,
      age: calculateAge(data.birthday),
    };
  });

// Helper function to check if one time is after another
//configure this function
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

export const TeacherScheduleCollegeValidator = z
  .object({
    teacherId: z.string().min(1, { message: 'Teacher is required...' }),
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

export const RoomCollegeValidator = z.object({
  roomName: z.string().min(1, { message: 'Room Name is required...' }),
  roomType: z.string().min(1, { message: 'Room Type is required...' }),
  floorLocation: z.string().optional(),
});



export const SchoolYearValidator = z.object({
  schoolYear: z
    .string()
    .min(1, { message: 'School Year is required...' })
    .refine((value) => /^(sy|sY|Sy|SY)\d{4}-\d{4}$/i.test(value ?? ''), { message: 'Invalid school year format. Use SY1999-2000' }),
  isEnable: z.boolean().default(false).optional(),
});
/**
 * @todo
 * change prospectus to curriculum
 */
export const ProspectusValidator = z.object({
  year: z.string().min(1, { message: 'School Year is required...' }),
  semester: z.string().min(1, { message: 'School Year is required...' }),
  order: z
    .string()
    .regex(/^(1[0-5]|[1-9])$/, { message: 'Order must only contain numbers 1-15.' })
    .refine((val) => Number(val) >= 1 && Number(val) <= 15, { message: 'Order must be between 1 and 15.' }),
});

export const CurriculumSubjectValidator = z.object({
  subjects: z.array(z.string().min(1, { message: 'Subject must least one day must be selected.' })).min(1, { message: 'At least one day must be selected.' }),
});
export const StudentCurriculumValidator = z.object({
  schoolYear: z.string().min(1, { message: 'School Year is required...' }),
  year: z.string().min(1, { message: 'Year is required...' }),
  semester: z.string().min(1, { message: 'Semester is required...' }),
  order: z
    .string()
    .regex(/^(1[0-5]|[1-9])$/, { message: 'Order must only contain numbers 1-15.' })
    .refine((val) => Number(val) >= 1 && Number(val) <= 15, { message: 'Order must be between 1 and 15.' }),
});

export const EnrollmentSetupOpenEnrollmentCollegeValidator = z.object({
  schoolYear: z.string().min(1, { message: 'Room Name is required...' }),
  semester: z.string().min(1, { message: 'Room Type is required...' }),
});
