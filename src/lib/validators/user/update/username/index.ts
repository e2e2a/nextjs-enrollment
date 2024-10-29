import { z } from 'zod';

export const UsernameValidator = z.object({
  username: z.string().min(1, { message: 'Username is Required...' }).max(10, { message: 'Username too long.' }),
});
