import { newEmailAction } from '@/action/user/email';
import { EmailValidator } from '@/lib/validators/user/email';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

/**
 * @authenticated
 * any role
 * Custom hook to handle update of user's email for any role.
 *
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */
export const useNewEmailMutation = () => {
  return useMutation<any, Error, z.infer<typeof EmailValidator>>({
    mutationFn: async (data) => newEmailAction(data),
  });
};
