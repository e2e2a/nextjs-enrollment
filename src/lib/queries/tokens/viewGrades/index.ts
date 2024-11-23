import { getVGTokenByParamsTokenAction } from '@/action/tokens/viewGrades';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook to query View Grade token.
 *
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */
export const useVGTokenQueryByParamsToken = (token: string) => {
  return useQuery<any, Error>({
    queryKey: ['ViewGradeTokenCheck', token],
    queryFn: async () => getVGTokenByParamsTokenAction(token),
    retry: 0,
  });
};
