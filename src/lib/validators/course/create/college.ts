import { z } from 'zod';

export const CourseValidatorInCollege = z.object({
  courseCode: z.string().min(1, { message: 'course is required...' }),
  name: z.string().min(1, { message: 'year must atleast 1 characters.' }),
  category: z.string().min(1, { message: 'year must atleast 1 characters.' }),
  description: z.string().min(1, { message: 'year must atleast 6 characters.' }),
});
