import { updateProfileBySessionIdAction } from '@/action/profile/update/session';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateProfileBySessionIdAction(data),
    onSuccess: (data) => {
      // switch (data.role) {
      //   case 'STUDENT':
      //     break;
      //   case 'TEACHER':
      //     break;
      //   case 'DEAN':
      //     break;
      //   case 'ADMIN':
      //     break;
      //   default:
      //     return { error: 'Forbidden.', status: 403 };
      // }
      queryClient.invalidateQueries({ queryKey: ['AllProfilesByRoles', data.role] });
      queryClient.invalidateQueries({ queryKey: ['ProfileBySessionId'] });
      queryClient.invalidateQueries({ queryKey: ['ProfileByParamsUserIdInAdmin', data.id] });
      queryClient.invalidateQueries({ queryKey: ['ProfileByParamsUserIdInDean', data.id] });
    },
  });
};
