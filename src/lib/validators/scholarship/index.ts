import { z } from 'zod';

export const ScholarshipValidator = z
  .object({
    category: z.string().min(1, { message: 'Category is required...' }),
    studentId: z.string().min(1, { message: 'Student is required...' }),
    name: z.string().min(1, { message: 'Scholarship Name is required...' }),
    year: z.string().min(1, { message: 'yYear is required...' }),
    semester: z.string().min(1, { message: 'Semester is required...' }),
    type: z.string().min(1, { message: 'Type is required...' }),
    amount: z.string().optional(),
    discountPercentage: z.string().optional(),
    exemptedFees: z.array(z.string().optional()),
  })
  .superRefine((value, ctx) => {
    if (value.type === 'percentage') {
      if (!value.discountPercentage) {
        ctx.addIssue({
          code: 'custom',
          message: 'Discount Percentage Fees is required.',
          path: ['discountPercentage'],
        });
      }
      if (value.exemptedFees.length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'At least one Exempted must be selected.',
          path: ['exemptedFees'],
        });
      }
    }
    if (value.type === 'fixed') {
      if (!value.amount) {
        ctx.addIssue({
          code: 'custom',
          message: 'Amount of fixed is required.',
          path: ['amount'],
        });
      }
    }
  });
