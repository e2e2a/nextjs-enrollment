import { z } from 'zod';

export const BlockValidatorInCollege = z.object({
  category: z.string().min(1, { message: 'year must atleast 1 characters.' }),
  courseCode: z.string().min(1, { message: 'course is required...' }),
  year: z.string().min(1, { message: 'year must atleast 6 characters.' }),
  semester: z.string().min(1, { message: 'year must atleast 1 characters.' }),
  section: z.string().min(1, { message: 'year must atleast 6 characters.' }).max(1, { message: 'Pick 1 letter from A-Z.' }),
  // description: z.string().min(1, { message: 'year must atleast 6 characters.' }),
  description: z.string().optional(),
});
