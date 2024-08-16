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
  email: z.string().email({ message: 'Email is Required.' }),
});

export const SigninValidator = z.object({
  email: z.string().email({ message: 'Email is Required.' }),
  password: z.string().min(1, { message: 'Password is Required.' }),
});

export const NewPasswordValidator = z
  .object({
    currentPassword: z.string().min(1, { message: 'Current password must atleast 1 characters.' }).optional(),
    password: z.string().min(6, { message: 'Password must atleast 6 characters.' }),
    CPassword: z.string(),
  })
  .refine((data) => data.password === data.CPassword, {
    message: "Confirmation password doesn't match!",
    path: ['CPassword'],
  });

const nameRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+[-'s]?[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/;
const fullNameRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+\s+[a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/;
const isValidDate = (dateString: string): boolean => {
  const date = parse(dateString, 'yyyy-MM-dd', new Date());
  return isValid(date) && date.toISOString().slice(0, 10) === dateString;
};
export const StudentProfileValidator = z.object({
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
  contact: z.string().min(6, { message: 'contact is required...' }),
  nationality: z.string().min(1, { message: 'Nationality is required...' }),
  sex: z.string().min(1, { message: 'Sex is required...' }),
  civilStatus: z.string().min(1, { message: 'Civil Status is required...' }),
  employmentStatus: z.string().min(1, { message: 'Employment Status is required...' }),
  birthday: z.date({required_error: 'Provide a valid date...'})
  .refine(
    (date) => {
      // const isNotInFuture = date <= new Date();
      const isAtLeast14YearsOld = calculateAge(date) >= 14;
      return  isAtLeast14YearsOld;
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
}).transform((data) => {
  return {
    ...data,
    age: calculateAge(data.birthday),
  };
});

export const CourseValidator = z
.object({
  courseCode: z.string().min(1, { message: 'course is required...' }),
  name: z.string().min(1, { message: 'year must atleast 1 characters.' }),
  description: z.string().min(1, { message: 'year must atleast 6 characters.' }),
})

export const EnrollmentStep1 = z
  .object({
    courseCode: z.string().min(1, { message: 'course is required...' }),
    studentYear: z.string().min(1, { message: 'year must atleast 1 characters.' }),
    studentSemester: z.string().min(1, { message: 'year must atleast 6 characters.' }),
  })
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
