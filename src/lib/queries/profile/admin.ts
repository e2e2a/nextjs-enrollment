import { getProfileByParamsUserIdAction } from '@/action/profile/admin';
import { getSingleProfileResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

/**
 *
 * only admin roles
 * @returns query of profile by session id or userId
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
