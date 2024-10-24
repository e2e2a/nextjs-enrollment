import { signInAction } from '@/action/auth/signIn';
import { SigninValidator } from '@/lib/validators/auth/signIn';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

/**
 * Custom hook to handle the sign-in mutation for users with any role.
 * 
 * This hook utilizes `useMutation` from React Query to manage the sign-in process,
 * and it automatically invalidates the queries on successful sign-in.
 *
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */
export const useSignInMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, z.infer<typeof SigninValidator>>({
    mutationFn: async (data) => signInAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['AllUsers'] });
    },
  });
};
