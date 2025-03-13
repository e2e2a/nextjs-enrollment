import { z } from 'zod';

export const StudentProfileExtension = z
  .object({
    studentStatus: z.string().min(1, { message: 'Student Status is required...' }),
    studentYear: z.string().min(1, { message: 'Student Year is required...' }),
    primarySchoolName: z.string().min(5, { message: 'School Name is required...' }).max(40, { message: 'School Name length too long.' }),
    primarySchoolYear: z.string().min(4, { message: 'School Year is required...' }).max(20, { message: 'School Year length too long.' }),
    secondarySchoolName: z.string().min(5, { message: 'School Name is required...' }).max(40, { message: 'School Name length too long.' }),
    secondarySchoolYear: z.string().min(4, { message: 'School Year is required...' }).max(20, { message: 'School Year length too long.' }),
    seniorHighSchoolName: z.string().optional(),
    seniorHighSchoolYear: z.string().optional(),
    seniorHighSchoolStrand: z.string().optional(),
    FathersLastName: z.string().min(2, { message: `Father's Last Name is required...` }).max(20, { message: `Father's Last Name length too long.` }),
    FathersFirstName: z.string().min(2, { message: `Father's First Name is required...` }).max(20, { message: `Father's First Name length too long.` }),
    FathersMiddleName: z.string(),
    FathersContact: z.string().optional(),
    FathersEmail: z.string().optional(),
    MothersLastName: z.string().min(2, { message: `Mother's Last Name is required...` }).max(20, { message: `Mother's Last Name length too long.` }),
    MothersFirstName: z.string().min(2, { message: `Mother's First Name is required...` }).max(20, { message: `Mother's First Name length too long.` }),
    MothersMiddleName: z.string(),
    MothersContact: z.string().optional(),
    MothersEmail: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.seniorHighSchoolName !== 'n/a') {
      ctx.addIssue({
        code: 'custom',
        message: 'Senior High School is required or can be n/a.',
        path: ['seniorHighSchoolName'],
      });
    }

    if (value.FathersFirstName.toLowerCase() !== 'n/a' && value.FathersLastName.toLowerCase() !== 'n/a') {
      if (!value.FathersContact) {
        ctx.addIssue({
          code: 'custom',
          message: 'Fathers Contact must be in the format +639XXXXXXXXX or 09XXXXXXXXX.',
          path: ['FathersContact'],
        });
      }
      const isValidContact = /^(\+63|0)9\d{9}$/.test(value.FathersContact || '');
      if (!isValidContact) {
        ctx.addIssue({
          code: 'custom',
          message: 'FathersContact must be in the format +639XXXXXXXXX or 09XXXXXXXXX.',
          path: ['FathersContact'],
        });
      }
      if (!value.FathersEmail) {
        ctx.addIssue({
          code: 'custom',
          message: 'Fathers Email is required.',
          path: ['FathersEmail'],
        });
      }
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.FathersEmail || '');
      if (!isValidEmail) {
        ctx.addIssue({
          code: 'custom',
          message: 'Email is not valid.',
          path: ['FathersEmail'],
        });
      }
    }
    if (value.MothersFirstName.toLowerCase() !== 'n/a' || value.MothersLastName.toLowerCase() !== 'n/a') {
      if (!value.MothersContact) {
        ctx.addIssue({
          code: 'custom',
          message: 'Mothers Contact must be in the format +639XXXXXXXXX or 09XXXXXXXXX.',
          path: ['MothersContact'],
        });
      }
      const isValidContact = /^(\+63|0)9\d{9}$/.test(value.MothersContact || '');
      if (!isValidContact) {
        ctx.addIssue({
          code: 'custom',
          message: 'FathersContact must be in the format +639XXXXXXXXX or 09XXXXXXXXX.',
          path: ['MothersContact'],
        });
      }
      if (!value.MothersEmail) {
        ctx.addIssue({
          code: 'custom',
          message: 'Mothers Email is required.',
          path: ['MothersEmail'],
        });
      }
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.MothersEmail || '');
      if (!isValidEmail) {
        ctx.addIssue({
          code: 'custom',
          message: 'Email is not valid.',
          path: ['MothersEmail'],
        });
      }
    }
  });
