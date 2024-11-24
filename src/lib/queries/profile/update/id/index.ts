import { updateProfileByAdminAction } from '@/action/profile/update/id';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateProfileByAdminMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateProfileByAdminAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['AllProfilesByRoles', data.role] });
        queryClient.invalidateQueries({ queryKey: ['ProfileBySessionId'] });
        queryClient.invalidateQueries({ queryKey: ['ProfileByParamsUserId', data.userId] });
      }
    },
  });
};
