import { newEmailAction } from '@/action/user/email';
import { EmailValidator } from '@/lib/validators/user/email';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

/**
 * Custom hook to handle update of user's email for any role.
 * 
 * This hook utilizes `useMutation` from React Query to manage the update process,
 * and it automatically invalidates the queries on successful sign-in.
 *
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */
export const useNewEmailMutation = () => {
  return useMutation<any, Error, z.infer<typeof EmailValidator>>({
    mutationFn: async (data) => newEmailAction(data),
  });
};
