import { newEmailActionByAdmin } from '@/action/user/update/id/email';
import { EmailValidator } from '@/lib/validators/user/update/email';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

/**
 * only admin
 * Custom hook to handle update of user's email for any role.
 *
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */
export const useNewEmailMutationByAdmin = () => {
  return useMutation<any, Error, z.infer<typeof EmailValidator>>({
    mutationFn: async (data) => newEmailActionByAdmin(data),
  });
};
