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

export const EmailValidator = z.object({
  email: z.string().email({ message: 'Email is Required...' }),
});
export const UsernameValidator = z.object({
  username: z.string().min(1, { message: 'Username is Required...' }).max(10, { message: 'Username too long.' }),
});
export const SigninValidator = z.object({
  email: z.string().email({ message: 'Email is Required...' }),
  password: z.string().min(1, { message: 'Password is Required...' }),
});

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
export const StudentProfileValidator = z
  .object({
    // firstname: z.string().min(2, { message: 'Firstname must atleast 2 characters...' }),
    firstname: z
      .string()
      .min(2, 'Name should have at least 2 characters')
      .refine((value) => nameRegex.test(value ?? ''), { message: 'Name should only contain valid alphabets...' }),
    middlename: z.string().min(1, { message: 'Middlename must atleast 2 characters...' }),
    lastname: z.string().min(2, { message: 'Lastname must atleast 2 characters...' }),
    //extension name added
    extensionName: z.string().optional(),
    numberStreet: z.string().min(1, { message: 'Number,Street is required...' }),
    barangay: z.string().min(1, { message: 'Barangay is required...' }),
    district: z.string().min(1, { message: 'District is required...' }),
    cityMunicipality: z.string().min(1, { message: 'City/Municipality is required...' }),
    province: z.string().min(1, { message: 'Province is required...' }),
    region: z.string().min(1, { message: 'Region is required...' }),
    emailFbAcc: z.string().optional(),
    contact: z
      .string()
      .min(11, { message: 'Contact number is required...' })
      .regex(/^(\+63|0)9\d{9}$/, { message: 'It should be either +639XXXXXXXXX or 09XXXXXXXXX.' }),
    nationality: z.string().min(1, { message: 'Nationality is required...' }),
    sex: z.string().min(1, { message: 'Sex is required...' }),
    civilStatus: z.string().min(1, { message: 'Civil Status is required...' }),
    employmentStatus: z.string().min(1, { message: 'Employment Status is required...' }),
    birthday: z.date({ required_error: 'Provide a valid date...' }).refine(
      (date) => {
        // const isNotInFuture = date <= new Date();
        const isAtLeast14YearsOld = calculateAge(date) >= 14;
        return isAtLeast14YearsOld;
      },
      {
        message: 'You must be at least 14 years old.',
      }
    ),
    age: z.number().optional(),
    birthPlaceCity: z.string().min(6, { message: 'City/Municipality is required...' }),
    birthPlaceProvince: z.string().min(6, { message: 'Province is required...' }),
    birthPlaceRegion: z.string().min(6, { message: 'Region is required...' }),
    educationAttainment: z.string().min(6, { message: 'Education Attainment is required.' }),
    learnerOrTraineeOrStudentClassification: z.string().min(1, { message: 'Classification is required...' }),
  })
  .transform((data) => {
    return {
      ...data,
      age: calculateAge(data.birthday),
    };
  });

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

export const SignupValidator = z
  .object({
    email: z.string().email({ message: 'Email is Required.' }),
    // firstname: z
    //   .string()
    //   .min(1, { message: 'Firstname must atleast 1 characters.' }),
    // lastname: z.string().min(1, { message: 'Lastname must atleast 1 characters.' }),
    username: z.string().min(1, { message: 'Username must atleast 1 characters.' }),
    password: z.string().min(6, { message: 'Password must atleast 6 characters.' }),
    CPassword: z.string(),
  })
  .refine((data) => data.password === data.CPassword, {
    message: "Confirmation password doesn't match!",
    path: ['CPassword'],
  });

export const RecoveryValidator = z.object({
  email: z.string().email({ message: 'Email is Required.' }),
});

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

export const SubjectCollegeValidator = z.object({
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
