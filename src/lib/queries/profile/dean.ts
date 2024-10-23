import { getProfileByParamsUserIdAction } from '@/action/profile/dean';
import { getSingleProfileResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

/**
 *
 * only admin roles
 * @returns query of profile by session id or userId
 */
export const useProfileQueryByParamsUserIdInDean = (id: string) => {
  return useQuery<getSingleProfileResponse, Error>({
    queryKey: ['ProfileByParamsUserIdInDean', id],
    queryFn: () => getProfileByParamsUserIdAction(id),
    enabled: !!id,
    retry: 0,
    refetchOnWindowFocus: true,
  });
};
