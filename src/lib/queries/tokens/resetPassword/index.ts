import { getRPTokenByParamsTokenAction } from '@/action/tokens/resetPassword';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook to query Reset Password token .
 *
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */
export const useRPTokenQueryByParamsToken = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ['RecoveryTokenCheck', token],
    queryFn: async () => getRPTokenByParamsTokenAction(token),
    retry: 0,
  });
};
