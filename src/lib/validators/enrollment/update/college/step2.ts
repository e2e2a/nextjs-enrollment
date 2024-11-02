import { z } from 'zod';

export const EnrollmentBlockTypeValidator = z
  .object({
    studentType: z.string().min(1, { message: 'Student Type is required...' }),
    blockType: z.string(),
  })
  .refine(
    (data) => {
      // If the student type is not 'regular', blockType must be present
      if (data.studentType === 'regular') {
        return data.blockType && data.blockType.trim() !== '';
      }
      // If student type is 'regular', we don't care about blockType
      return true;
    },
    {
      message: 'Block Type is required for regular students.',
      path: ['blockType'],
    }
  );


