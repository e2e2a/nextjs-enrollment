import { z } from 'zod';
import { parse, isValid, isBefore, differenceInYears } from 'date-fns';

const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
  }
  return age;
};

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
