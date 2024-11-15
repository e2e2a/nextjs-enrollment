import { adminCreateUserWithRoleAction } from '@/action/user/create';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAdminCreateUserRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => adminCreateUserWithRoleAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['AllProfilesByRoles', data.role] });
        queryClient.invalidateQueries({ queryKey: ['AllUsers'] });
      }
    },
  });
};
