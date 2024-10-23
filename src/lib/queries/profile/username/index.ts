import { newUsernameAction } from '@/action/profile/username';
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

        case 'DEAN':

        case 'ADMIN':
          queryClient.invalidateQueries({ queryKey: ['userAdminProfile'] });

        default:
          return { error: 'Forbidden.', status: 403 };
      }
    },
  });
};
