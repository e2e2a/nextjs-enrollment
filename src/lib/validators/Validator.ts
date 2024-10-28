import { z } from 'zod';
import { parse, isValid, isBefore, differenceInYears } from 'date-fns';
const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  // console.log(new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate()))
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Adjust if the birthday hasn't occurred yet this year
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    // return age - 1;
  }
  return age;
};


// export const NewPasswordValidator = z
//   .object({
//     currentPassword: z.string().min(1, { message: 'Current password must atleast 1 characters.' }).optional(),
//     password: z.string().min(6, { message: 'Password must atleast 6 characters.' }),
//     CPassword: z.string(),
//   })
//   .refine((data) => data.password === data.CPassword, {
//     message: "Confirmation password doesn't match!",
//     path: ['CPassword'],
//   });

const nameRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+[-'s]?[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/;
const fullNameRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+\s+[a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/;
const isValidDate = (dateString: string): boolean => {
  const date = parse(dateString, 'yyyy-MM-dd', new Date());
  return isValid(date) && date.toISOString().slice(0, 10) === dateString;
};


/**
 * @todo change "EnrollmentStep1" to "EnrollmentStep0"
 */
export const EnrollmentStep1 = z
  .object({
    courseCode: z.string().min(1, { message: 'Course is required...' }),
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
  .superRefine((value, ctx) => {
    if (value.FathersFirstName.toLowerCase() !== 'n/a' && value.FathersLastName.toLowerCase() !== 'n/a') {
      if (!value.FathersContact) {
        ctx.addIssue({
          code: 'custom',
          message: 'Fathers Contact must be in the format +639XXXXXXXXX or 09XXXXXXXXX.',
          path: ['FathersContact'],
        });
      }
      const isValid = /^(\+63|0)9\d{9}$/.test(value.FathersContact || '');
      if (!isValid) {
        ctx.addIssue({
          code: 'custom',
          message: 'FathersContact must be in the format +639XXXXXXXXX or 09XXXXXXXXX.',
          path: ['FathersContact'],
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
      const isValid = /^(\+63|0)9\d{9}$/.test(value.MothersContact || '');

      if (!isValid) {
        ctx.addIssue({
          code: 'custom',
          message: 'FathersContact must be in the format +639XXXXXXXXX or 09XXXXXXXXX.',
          path: ['MothersContact'],
        });
      }
    }
  });

export const EnrollmentApprovedStep2 = z.object({
  studentType: z.string().min(1, { message: 'course is required...' }),
  scholarType: z.string().min(1, { message: 'year must atleast 1 characters.' }),
});

// export const SignupValidator = z
//   .object({
//     email: z.string().email({ message: 'Email is Required.' }),
//     // firstname: z
//     //   .string()
//     //   .min(1, { message: 'Firstname must atleast 1 characters.' }),
//     // lastname: z.string().min(1, { message: 'Lastname must atleast 1 characters.' }),
//     username: z.string().min(1, { message: 'Username must atleast 1 characters.' }),
//     password: z.string().min(6, { message: 'Password must atleast 6 characters.' }),
//     CPassword: z.string(),
//   })
//   .refine((data) => data.password === data.CPassword, {
//     message: "Confirmation password doesn't match!",
//     path: ['CPassword'],
//   });



export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  username: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email(),
  bio: z.string(),
});

// ============================================================
// POST
// ============================================================
export const PostValidation = z.object({
  caption: z.string().min(5, { message: 'Minimum 5 characters.' }).max(2200, { message: 'Maximum 2,200 caracters' }),
  file: z.custom<File[]>(),
  location: z.string().min(1, { message: 'This field is required' }).max(1000, { message: 'Maximum 1000 characters.' }),
  tags: z.string(),
});

/**
 * Admin Courses Validation
 * @validate
 */
export const CourseValidator = z.object({
  courseCode: z.string().min(1, { message: 'course is required...' }),
  name: z.string().min(1, { message: 'year must atleast 1 characters.' }),
  category: z.string().min(1, { message: 'year must atleast 1 characters.' }),
  description: z.string().min(1, { message: 'year must atleast 6 characters.' }),
});

export const CourseBlockCollegeValidator = z.object({
  category: z.string().min(1, { message: 'year must atleast 1 characters.' }),
  courseCode: z.string().min(1, { message: 'course is required...' }),
  year: z.string().min(1, { message: 'year must atleast 6 characters.' }),
  semester: z.string().min(1, { message: 'year must atleast 1 characters.' }),
  section: z.string().min(1, { message: 'year must atleast 6 characters.' }),
  description: z.string().min(1, { message: 'year must atleast 6 characters.' }),
});
