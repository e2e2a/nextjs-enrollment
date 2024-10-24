import { signInAction } from '@/action/auth/signIn';
import { SigninValidator } from '@/lib/validators/auth/signIn';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

/**
 * Custom hook to handle the sign-in mutation for users with any role.
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
