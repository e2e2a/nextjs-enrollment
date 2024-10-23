import { newUsernameAction } from '@/action/user/username';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * can be used by all roles
 * @returns change username
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
      queryClient.invalidateQueries({ queryKey: ['ProfileByParamsUserId', data.id] });
    },
  });
};
