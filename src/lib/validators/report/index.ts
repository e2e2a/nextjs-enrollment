import { z } from 'zod';

export const PrintReportValidatorInCollege = z
  .object({
    category: z.string().min(1, { message: 'year must atleast 1 characters.' }),
    printSelection: z.string().min(1, { message: 'Type is required...' }),
    selectionScope: z.string().min(1, { message: 'Scope is required...' }),
    exportType: z.string().min(1, { message: 'Select export type...' }),
    studentType: z.string().optional(),
    year: z.string().optional(),
    semester: z.string().optional(),
    individualSelectionId: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.selectionScope.toLowerCase() !== 'all') {
      if (!value.selectionScope) {
        ctx.addIssue({
          code: 'custom',
          message: 'Scope is required...',
          path: ['selectionScope'],
        });
      }
      if (!value.individualSelectionId) {
        ctx.addIssue({
          code: 'custom',
          message: 'Please select one from the available options for individual printing.',
          path: ['individualSelectionId'],
        });
      }
    }
  });
