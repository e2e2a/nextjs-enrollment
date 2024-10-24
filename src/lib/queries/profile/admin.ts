import { getProfileByParamsUserIdAction } from '@/action/profile/admin';
import { getSingleProfileResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

/**
 * @authenticated
 * role admin
 * Custom hook to query profile of student by param id.
 * 
 * @param {string} id
 * @returns query of profile by session id or userId
 */
export const useProfileQueryByParamsUserId = (id: string) => {
  return useQuery<getSingleProfileResponse, Error>({
    queryKey: ['ProfileByParamsUserIdInAdmin', id],
    queryFn: () => getProfileByParamsUserIdAction(id),
    enabled: !!id,
    retry: 0,
    refetchOnWindowFocus: true,
  });
};
