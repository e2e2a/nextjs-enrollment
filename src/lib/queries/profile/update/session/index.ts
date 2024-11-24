import { updateProfileBySessionIdAction } from '@/action/profile/update/session';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateProfileBySessionIdAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['AllProfilesByRoles', data.role] });
        queryClient.invalidateQueries({ queryKey: ['ProfileBySessionId'] });
        queryClient.invalidateQueries({ queryKey: ['ProfileByParamsUserId', data.userId] });
      }
    },
  });
};
