import { z } from 'zod';

const isAtLeastAge = (age: number) => (date: Date) => {
  const today = new Date();
  const birthDate = new Date(date);
  const ageDiff = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  
  if (ageDiff > age) return true;
  if (ageDiff === age && monthDiff > 0) return true;
  if (ageDiff === age && monthDiff === 0 && dayDiff >= 0) return true;
  
  return false;
};

export const EmailValidator = z.object({
  email: z.string().email({ message: 'Email is Required.' }),
});

export const SigninValidator = z.object({
  email: z.string().email({ message: 'Email is Required.' }),
  password: z.string().min(1, { message: 'Password is Required.' }),
});

const BirthdayValidator = z
  .string()
  .refine(value => !isNaN(Date.parse(value)), {
    message: "Invalid date format",
  })
  .transform(value => new Date(value))
  .refine(isAtLeastAge(16), {
    message: "You must be at least 18 years old",
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

export const StudentProfileValidator = z.object({
  firstname: z.string().min(2, { message: 'Firstname must atleast 2 characters.' }),
  middlename: z.string().min(1, { message: 'Middlename must atleast 1 characters.' }),
  lastname: z.string().min(2, { message: 'Lastname must atleast 2 characters.' }),
  numberStreet: z.string().min(1, { message: 'Number,Street is required.' }),
  barangay: z.string().min(1, { message: 'Barangay is required.' }),
  district: z.string().min(1, { message: 'District is required.' }),
  cityMunicipality: z.string().min(1, { message: 'City/Municipality is required.' }),
  province: z.string().min(1, { message: 'Province is required.' }),
  region: z.string().min(1, { message: 'Region is required.' }),
  emailFbAcc: z.string().optional(),
  contact: z.string().min(6, { message: 'contact is required.' }),
  nationality: z.string().min(1, { message: 'Nationality is required.' }),
  sex: z.string().min(1, { message: 'Sex is required.' }),
  civilStatus: z.string().min(1, { message: 'Civil Status is required.' }),
  employmentStatus: z.string().min(1, { message: 'Employment Status is required.' }),
  birthday: z.date({
    required_error: "Birthday is required."
  }),
  birthPlaceCity: z.string().min(6, { message: 'City/Municipality is required.' }),
  birthPlaceProvince: z.string().min(6, { message: 'Province is required..' }),
  birthPlaceRegion: z.string().min(6, { message: 'Region is required.' }),
  educationAttainment: z.string().min(6, { message: 'Education Attainment is required.' }),
  learnerOrTraineeOrStudentClassification: z.string().min(6, { message: 'Password must is required.' }),
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
