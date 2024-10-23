import { getStudentProfileBySessionIdAction } from '@/action/profile';
import { getSingleProfileResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

/**
 *
 * any roles
 * @returns query of profile by session id or userId
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
