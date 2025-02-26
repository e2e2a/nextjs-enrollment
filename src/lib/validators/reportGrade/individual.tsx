import { z } from 'zod';

export const ReportGradeSingleValidatorInCollege = z.object({
  type: z.string().min(1, { message: 'Type is required...' }),
  studentId: z.string().min(1, { message: 'Student must atleast 1 characters.' }),
  category: z.string().min(1, { message: 'year must atleast 1 characters.' }),
  grade: z.string().min(1, { message: 'Grade 1 characters.' }),
});
