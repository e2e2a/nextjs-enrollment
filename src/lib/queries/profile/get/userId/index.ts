import { getProfileByParamsUserIdAction } from '@/action/profile/get/userId';
import { getSingleProfileResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook query profile by user id.
 *
 * @param {string} id
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */
export const useProfileQueryByParamsUserId = (id: string) => {
  return useQuery<getSingleProfileResponse, Error>({
    queryKey: ['ProfileByParamsUserId', id],
    queryFn: () => getProfileByParamsUserIdAction(id),
    enabled: !!id,
    retry: 0,
    refetchOnWindowFocus: true,
  });
};
