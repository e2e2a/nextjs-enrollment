import { z } from 'zod';
import { parse, isValid, isBefore, differenceInYears } from 'date-fns';

export const EnrollmentStep1 = z
  .object({
    studentStatus: z.string().min(1, { message: 'Student Status is required...' }),
    studentYear: z.string().min(1, { message: 'Student Year is required...' }),
    studentSemester: z.string().min(1, { message: 'Student Semester is required...' }),
    schoolYear: z.string().min(1, { message: 'School Year is required...' }),
    primarySchoolName: z.string().min(5, { message: 'School Name is required...' }).max(30, { message: 'School Name length too long.' }),
    primarySchoolYear: z.string().min(4, { message: 'School Year is required...' }).max(20, { message: 'School Year length too long.' }),
    secondarySchoolName: z.string().min(5, { message: 'School Name is required...' }).max(30, { message: 'School Name length too long.' }),
    secondarySchoolYear: z.string().min(4, { message: 'School Year is required...' }).max(20, { message: 'School Year length too long.' }),
    seniorHighSchoolName: z.string().min(5, { message: 'School Name is required...' }).max(30, { message: 'School Name length too long.' }),
    seniorHighSchoolYear: z.string().min(4, { message: 'School Year is required...' }).max(20, { message: 'School Year length too long.' }),
    seniorHighSchoolStrand: z.string().min(3, { message: 'School Strand is required...' }).max(20, { message: 'School Strand length too long.' }),
    FathersLastName: z.string().min(2, { message: `Father's Last Name is required...` }).max(20, { message: `Father's Last Name length too long.` }),
    FathersFirstName: z.string().min(2, { message: `Father's First Name is required...` }).max(20, { message: `Father's First Name length too long.` }),
    FathersMiddleName: z.string(),
    FathersContact: z.string().optional(),
    MothersLastName: z.string().min(2, { message: `Mother's Last Name is required...` }).max(20, { message: `Mother's Last Name length too long.` }),
    MothersFirstName: z.string().min(2, { message: `Mother's First Name is required...` }).max(20, { message: `Mother's First Name length too long.` }),
    MothersMiddleName: z.string(),
    MothersContact: z.string().optional(),
  })
  