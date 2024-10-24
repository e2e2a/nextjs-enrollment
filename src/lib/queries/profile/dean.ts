import { getProfileByParamsUserIdAction } from '@/action/profile/dean';
import { getSingleProfileResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

/**
 * @authenticated
 * role dean
 * Custom hook to query profile of student by param id.
 * 
 * @param {string} id
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
