import { z } from 'zod';

export const RecoveryValidator = z.object({
  email: z.string().email({ message: 'Email is Required.' }),
});
