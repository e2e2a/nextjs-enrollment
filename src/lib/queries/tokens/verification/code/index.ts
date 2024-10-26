import { verificationCodeAction } from '@/action/tokens/verification/code';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Custom hook to handle verification code for any role.
 *
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */
export const useVerificationcCodeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => verificationCodeAction(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ProfileBySessionId'] });
      queryClient.invalidateQueries({ queryKey: ['ProfileByParamsUserIdInAdmin', data.id] });
    },
  });
};
