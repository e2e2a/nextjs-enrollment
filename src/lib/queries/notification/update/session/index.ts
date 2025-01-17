import { updateNotificationBySessionIdAction } from '@/action/notifications/update/session';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateNotificationBySessionIdMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateNotificationBySessionIdAction(data),
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['NotificationBySessionId'] });
        queryClient.invalidateQueries({ queryKey: ['NotificationBySessionId', data.userId, 'FRESH', 0] }); // @todo broadcast
        queryClient.invalidateQueries({ queryKey: ['NotificationBySessionId', data.userId, 'OLD', 0] }); // @todo broadcast
      }
    },
  });
};
