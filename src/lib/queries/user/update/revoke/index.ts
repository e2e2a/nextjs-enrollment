import { revokeUserAction } from '@/action/user/update/id/revoke';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * only super admin
 * Custom hook to handle update of user's revoke.
 *
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */
export const useRevokeUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => revokeUserAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['AllProfilesByRoles', data.role] });
        queryClient.invalidateQueries({ queryKey: ['AllUsers'] });
      }
    },
  });
};
