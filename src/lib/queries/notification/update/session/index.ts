import { updateNotificationBySessionIdAction } from '@/action/notifications/update/session';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateNotificationBySessionIdMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateNotificationBySessionIdAction(data),
    onSuccess: async (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['NotificationBySessionId'] });
        queryClient.invalidateQueries({ queryKey: ['NotificationBySessionId', data.userId, 'FRESH', 0] }); // @todo broadcast
        queryClient.invalidateQueries({ queryKey: ['NotificationBySessionId', data.userId, 'OLD', 0] }); // @todo broadcast

        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [{ key1: 'NotificationBySessionId', key2: '' }],
          },
        });
      }
    },
  });
};
