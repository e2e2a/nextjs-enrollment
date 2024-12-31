import { z } from 'zod';
import { parse, isValid, isBefore, differenceInYears } from 'date-fns';

export const EnrollmentOldStudentFormValidator = z
  .object({
    studentStatus: z.string().min(1, { message: 'Student Status is required...' }),
    studentYear: z.string().min(1, { message: 'Student Year is required...' }),
    studentSemester: z.string().min(1, { message: 'Student Semester is required...' }),
    schoolYear: z.string().min(1, { message: 'School Year is required...' }),
    
    numberStreet: z.string().min(1, { message: 'Number,Street is required...' }),
    barangay: z.string().min(1, { message: 'Barangay is required...' }),
    district: z.string().min(1, { message: 'District is required...' }),
    cityMunicipality: z.string().min(1, { message: 'City/Municipality is required...' }),
    province: z.string().min(1, { message: 'Province is required...' }),
    
    contact: z
      .string()
      .min(11, { message: 'Contact number is required...' })
      .regex(/^(\+63|0)9\d{9}$/, { message: 'It should be either +639XXXXXXXXX or 09XXXXXXXXX.' }),
    civilStatus: z.string().min(1, { message: 'Civil Status is required...' }),
  })
  