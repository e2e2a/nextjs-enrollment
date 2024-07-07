import { z } from 'zod';

export const SigninValidator = z.object({
  email: z.string().email({ message: 'Email is Required.' }),
  password: z.string().min(1, { message: 'Password is Required.' }),
});

export const NewPasswordValidator = z.object({
  password: z.string().min(6, { message: 'Password must atleast 6 characters.' }),
  CPassword: z.string(),
}).refine((data) => data.password === data.CPassword, {
  message: "Confirmation password doesn't match!",
  path: ['CPassword'],
});

export const SignupValidator = z
  .object({
    email: z.string().email({ message: 'Email is Required.' }),
    firstname: z
      .string()
      .min(1, { message: 'Firstname must atleast 1 characters.' }),
    lastname: z.string().min(1, { message: 'Lastname must atleast 1 characters.' }),
    username: z.string().min(1, { message: 'Username must atleast 1 characters.' }),
    password: z.string().min(6, { message: 'Password must atleast 6 characters.' }),
    CPassword: z.string(),
  })
  .refine((data) => data.password === data.CPassword, {
    message: "Confirmation password doesn't match!",
    path: ['CPassword'],
  });

export const RecoveryValidator = z
  .object({
    email: z.string().email({ message: 'Email is Required.' }),
  })
  
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
  caption: z
    .string()
    .min(5, { message: 'Minimum 5 characters.' })
    .max(2200, { message: 'Maximum 2,200 caracters' }),
  file: z.custom<File[]>(),
  location: z
    .string()
    .min(1, { message: 'This field is required' })
    .max(1000, { message: 'Maximum 1000 characters.' }),
  tags: z.string(),
});
