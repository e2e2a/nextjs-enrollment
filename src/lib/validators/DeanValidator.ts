import { z } from 'zod';
const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    // return age - 1;
  }
  return age;
};
const nameRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+[-'s]?[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/;
export const DeanValidator = z
  .object({
    email: z.string().email({ message: 'Email is Required...' }),
    category: z.string().min(1, { message: 'Course is Required...' }),
    courseId: z.string().min(1, { message: 'Category is Required...' }),
    username: z.string().min(1, { message: 'Username must atleast 1 characters.' }),
    password: z.string().min(6, { message: 'Password must atleast 6 characters.' }),
    CPassword: z.string(),
  })
  .refine((data) => data.password === data.CPassword, {
    message: "Confirmation password doesn't match!",
    path: ['CPassword'],
  });
export const DeanProfileValidator = z
  .object({
    email: z.string().email({ message: 'Email is Required...' }),
    category: z.string().min(1, { message: 'Course is Required...' }),
    courseId: z.string().min(1, { message: 'Category is Required...' }),
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

