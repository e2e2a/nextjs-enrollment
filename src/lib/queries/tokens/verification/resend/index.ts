import { verificationCodeResend } from '@/action/tokens/verification/resend';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Custom hook to handle resend verification code for any role.
 *
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */
export const useResendVCodeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => verificationCodeResend(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['VerificationToken', data.token.token] });
    },
  });
};
