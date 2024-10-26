import { resetPasswordAction } from '@/action/tokens/resetPassword/resetPassword';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Custom hook to Reset Password.
 *
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */
export const useResetPasswordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => resetPasswordAction(data),
    onSuccess: (data) => {},
  });
};
