import { z } from 'zod';

export const EmailValidator = z.object({
  email: z.string().email({ message: 'Email is Required...' }),
});
