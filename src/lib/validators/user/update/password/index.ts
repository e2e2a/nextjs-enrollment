import { z } from 'zod';

export const NewPasswordValidator = z
  .object({
    currentPassword: z.string().min(1, { message: 'Current password must atleast 1 characters.' }),
    password: z.string().min(6, { message: 'Password must atleast 6 characters.' }),
    CPassword: z.string(),
  })
  .refine((data) => data.password === data.CPassword, {
    message: "Confirmation password doesn't match!",
    path: ['CPassword'],
  });
