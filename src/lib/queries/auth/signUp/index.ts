import { signUpAction } from '@/action/auth/signUp';
import { SignupValidator } from '@/lib/validators/auth/signUp';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

/**
 * Custom hook to handle the sign-up mutation for users with any role.
 *
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */
export const useSignUpMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, z.infer<typeof SignupValidator>>({
    mutationFn: async (data) => signUpAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Students'] });
    },
  });
};
