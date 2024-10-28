import { z } from "zod";

export const SubjectValidator = z.object({
    category: z.string().min(1, { message: 'year must atleast 1 characters.' }),
    fixedRateAmount: z.string().min(1, { message: 'Rate Amouns is required...' }).regex(/^\d+(\.\d{1,2})?$/, { message: 'Rate Amount must be a number.' }),
    preReq: z.string().optional(),
    subjectCode: z.string().min(1, { message: 'Subject Code is required...' }),
    name: z.string().min(1, { message: 'name is required...' }),
    lec: z
      .string()
      .length(1, { message: 'Lec must be exactly 1 digit.' })
      .regex(/^[0-9]+$/, { message: 'Lec must only contain numbers 0-9.' }),
    lab: z
      .string()
      .length(1, { message: 'Lab must be exactly 1 digit.' })
      .regex(/^[0-9]+$/, { message: 'Lab must only contain numbers 0-9.' }),
    unit: z
      .string()
      .length(1, { message: 'Unit must be exactly 1 digit.' })
      .regex(/^[0-9]+$/, { message: 'Unit must only contain numbers 0-9.' })
      .refine((val) => Number(val) > 0, { message: 'Unit must be greater than 0.' }),
  });