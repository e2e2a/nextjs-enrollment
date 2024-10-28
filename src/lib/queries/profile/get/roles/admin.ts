import { getAllUserByRoleAction } from '@/action/profile/get/role/admin';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook query profile by session id.
 *
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */
export const useAllProfileQueryByUserRoles = (role: string) => {
  return useQuery<any, Error>({
    queryKey: ['AllProfilesByRoles', role],
    queryFn: () => getAllUserByRoleAction(role),
    enabled: !!role,
    retry: 0,
    refetchOnWindowFocus: false,
  });
};
