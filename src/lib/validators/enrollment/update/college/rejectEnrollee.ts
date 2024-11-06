import { z } from 'zod';

export const RejectedRemarkValidator = z.object({
  rejectedRemark: z.string().min(10, { message: 'Remark is required...' }),
});
