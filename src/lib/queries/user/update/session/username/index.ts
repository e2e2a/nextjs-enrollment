import { newUsernameAction } from '@/action/user/update/session/username';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * @authenticated
 * any role
 * Custom hook to handle update of user's username for any role.
 * 
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */

/**
 * 
 * @todo update the profile and query of profile
 */
export const useNewUsernameMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => newUsernameAction(data),
    onSuccess: (data) => {
      switch (data.role) {
        case 'STUDENT':
          break
        case 'TEACHER':
          break
        case 'DEAN':
          break
        case 'ADMIN':
          break
        default:
          return { error: 'Forbidden.', status: 403 };
      }
      queryClient.invalidateQueries({ queryKey: ['ProfileBySessionId'] });
      queryClient.invalidateQueries({ queryKey: ['AllProfilesByRoles', data.role] });
      queryClient.invalidateQueries({ queryKey: ['ProfileByParamsUserIdInAdmin', data.id] });
      queryClient.invalidateQueries({ queryKey: ['ProfileByParamsUserIdInDean', data.id] });
    },
  });
};
