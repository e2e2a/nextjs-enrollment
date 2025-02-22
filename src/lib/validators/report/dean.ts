import { z } from 'zod';

export const PrintReportValidatorInCollege = z.object({
  category: z.string().min(1, { message: 'year must atleast 1 characters.' }),
  printSelection: z.string().min(1, { message: 'Type is required...' }),
  selectionScope: z.string().min(1, { message: 'Scope is required...' }),
  exportType: z.string().min(1, { message: 'Select export type...' }),
  individualSelectionId: z.string().optional(),
}) .superRefine((value, ctx) => {
    if (value.selectionScope.toLowerCase() !== 'all') {
      if (!value.selectionScope) {
        ctx.addIssue({
          code: 'custom',
          message: 'Scope is required...',
          path: ['selectionScope'],
        });
      }
    //   const isValidContact = /^(\+63|0)9\d{9}$/.test(value.FathersContact || '');
    //   if (!isValidContact) {
    //     ctx.addIssue({
    //       code: 'custom',
    //       message: 'FathersContact must be in the format +639XXXXXXXXX or 09XXXXXXXXX.',
    //       path: ['FathersContact'],
    //     });
    //   }
      if (!value.individualSelectionId) {
        ctx.addIssue({
          code: 'custom',
          message: 'Please select one from the available options for individual printing.',
          path: ['individualSelectionId'],
        });
      }
    //   const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.FathersEmail || '');
    //   if (!isValidEmail) {
    //     ctx.addIssue({
    //       code: 'custom',
    //       message: 'Email is not valid.',
    //       path: ['FathersEmail'],
    //     });
    //   }
    }
  });
