import { z } from 'zod';
import { parse, isValid, isBefore, differenceInYears } from 'date-fns';

export const EnrollmentApprovedStep2 = z.object({
  studentType: z.string().min(1, { message: 'course is required...' }),
  scholarType: z.string().min(1, { message: 'year must atleast 1 characters.' }),
});

// ============================================================
// POST
// ============================================================
export const PostValidation = z.object({
  caption: z.string().min(5, { message: 'Minimum 5 characters.' }).max(2200, { message: 'Maximum 2,200 caracters' }),
  file: z.custom<File[]>(),
  location: z.string().min(1, { message: 'This field is required' }).max(1000, { message: 'Maximum 1000 characters.' }),
  tags: z.string(),
});
