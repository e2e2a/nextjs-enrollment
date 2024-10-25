import { getTokenByParamsTokenAction } from '@/action/verificationToken';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook to query verification Token by param token.
 *
 * @param {string} token
 * @returns query of profile by session id or userId
 */
export const useTokenQueryByParamsToken = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ['VerificationToken', token],
    queryFn: async () => getTokenByParamsTokenAction(token),
    enabled: !!token,
    retry: 0,
    refetchOnWindowFocus: false,
    // retryDelay: (attemptIndex) => attemptIndex * 1000,
  });
};
