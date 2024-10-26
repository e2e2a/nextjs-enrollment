import { getStudentProfileBySessionIdAction } from '@/action/profile/get/session';
import { getSingleProfileResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook query profile by session id.
 *
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */
export const useProfileQueryBySessionId = () => {
  return useQuery<getSingleProfileResponse, Error>({
    queryKey: ['ProfileBySessionId'],
    queryFn: () => getStudentProfileBySessionIdAction(),
    enabled: true,
    retry: 0,
    refetchOnWindowFocus: false,
  });
};
