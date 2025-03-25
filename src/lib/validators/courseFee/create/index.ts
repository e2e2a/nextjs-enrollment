import { z } from 'zod';

export const CourseFeeValidator = z.object({
  courseCode: z.string().min(1, { message: 'Course is required...' }),
  year: z.string().min(1, { message: 'Year is required...' }),
  ratePerUnit: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: 'Rate Per Unit must be a valid number...' })
    .min(1, { message: 'Rate Per Unit is required...' }),
  ratePerLab: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: 'Rate Per Lab must be a valid number...' })
    .min(1, { message: 'Rate Per Lab is required...' }),
  insuranceFee: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: 'Insurance Fee must be a valid number...' })
    .min(1, { message: 'Insurance Fee is required...' }),
  departmentalFee: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: 'Departmental Fee must be a valid number...' })
    .min(1, { message: 'Departmental Fee is required...' }),
  ssgFee: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: 'SSG Fee must be a valid number...' })
    .min(1, { message: 'SSG Fee is required...' }),
  passbookFee: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: 'Passbook Fee must be a valid number...' })
    .min(1, { message: 'SSG Fee is required...' }),
  cwtsOrNstpFee: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: 'CWTS or NSTP Fee must be a valid number...' })
    .min(1, { message: 'CWTS or NSTP Fee is required...' }),
  downPayment: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: 'Down Payment must be a valid number...' })
    .min(1, { message: 'Down Payment is required...' }),
  ojtFee: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: 'OJT Fee must be a valid number...' })
    .min(1, { message: 'Down Payment is required...' }),
});
