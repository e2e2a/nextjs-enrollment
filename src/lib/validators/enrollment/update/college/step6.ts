import { z } from 'zod';

export const EnrollmentStatusValidator = z.object({
  enrollStatus: z.string().min(1, { message: 'Student Status is required...' }),
});
