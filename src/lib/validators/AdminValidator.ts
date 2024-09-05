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
const nameRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+[-'s]?[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/;
export const TeacherProfileValidator = z
  .object({
    email: z.string().email({ message: 'Email is Required...' }),
    username: z.string().min(1, { message: 'Middlename must atleast 2 characters...' }),
    firstname: z
      .string()
      .min(2, 'Name should have at least 2 characters')
      .refine((value) => nameRegex.test(value ?? ''), { message: 'Name should only contain valid alphabets...' }),
    middlename: z.string().min(1, { message: 'Middlename must atleast 2 characters...' }),
    lastname: z.string().min(2, { message: 'Lastname must atleast 2 characters...' }),
    extensionName: z.string().optional(),
    contact: z
      .string()
      .min(11, { message: 'Contact number is required...' })
      .regex(/^(\+63|0)9\d{9}$/, { message: 'It should be either +639XXXXXXXXX or 09XXXXXXXXX.' }),
    sex: z.string().min(1, { message: 'Sex is required...' }),
    civilStatus: z.string().min(1, { message: 'Civil Status is required...' }),
    birthday: z.date({ required_error: 'Provide a valid date...' }).refine(
      (date) => {
        const isAtLeast14YearsOld = calculateAge(date) >= 14;
        return isAtLeast14YearsOld;
      },
      {
        message: 'You must be at least 14 years old.',
      }
    ),
    age: z.number().optional(),
    password: z.string().min(6, { message: 'Password must atleast 6 characters.' }),
    CPassword: z.string(),
  })
  .refine((data) => data.password === data.CPassword, {
    message: "Confirmation password doesn't match!",
    path: ['CPassword'],
  })
  .transform((data) => {
    return {
      ...data,
      age: calculateAge(data.birthday),
    };
  });

export const StudentProfileValidator = z
  .object({
    // firstname: z.string().min(2, { message: 'Firstname must atleast 2 characters...' }),
    email: z.string().email({ message: 'Email is Required...' }),
    username: z.string().min(1, { message: 'Middlename must atleast 2 characters...' }),
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
    password: z.string().min(6, { message: 'Password must atleast 6 characters.' }),
    CPassword: z.string(),
  })
  .refine((data) => data.password === data.CPassword, {
    message: "Confirmation password doesn't match!",
    path: ['CPassword'],
  })
  .transform((data) => {
    return {
      ...data,
      age: calculateAge(data.birthday),
    };
  });
