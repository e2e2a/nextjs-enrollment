import { z } from 'zod';

export const DownPaymentValidator = z.object({
  courseCode: z.string().min(1, { message: 'Course is required...' }),
  defaultPayment: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: 'Default Payment must be a valid number...' })
    .min(1, { message: 'Default Payment is required...' }),
});
