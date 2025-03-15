import { z } from 'zod';

export const TuitionFeeValidator = z.object({
  courseCode: z.string().min(1, { message: 'Course is required...' }),
  year: z.string().min(1, { message: 'Year is required...' }),
  ratePerUnit: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: 'Default Payment must be a valid number...' })
    .min(1, { message: 'Default Payment is required...' }),
  ratePerLab: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: 'Default Payment must be a valid number...' })
    .min(1, { message: 'Default Payment is required...' }),
  departmentalFee: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: 'Default Payment must be a valid number...' })
    .min(1, { message: 'Default Payment is required...' }),
  ssgFee: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: 'Default Payment must be a valid number...' })
    .min(1, { message: 'Default Payment is required...' }),
  cwtsOrNstpFee: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: 'Default Payment must be a valid number...' })
    .min(1, { message: 'Default Payment is required...' }),
  downPayment: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: 'Default Payment must be a valid number...' })
    .min(1, { message: 'Default Payment is required...' }),
});
