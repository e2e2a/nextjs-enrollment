import { updateNotificationBySessionIdAction } from '@/action/notifications/update/session';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateNotificationBySessionIdMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateNotificationBySessionIdAction(data),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['NotificationBySessionId', data.userId] }); // @todo broadcast
      }
    },
  });
};
