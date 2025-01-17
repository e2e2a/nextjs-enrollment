import { getNotificationBySessionIdAction } from '@/action/notifications/get/session';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook query Notification by session id.
 *
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */
export const useNotificationQueryBySessionId = (userId: string, type: string, number?: number) => {
  return useQuery<any, Error>({
    queryKey: ['NotificationBySessionId', userId, type, number || 0],
    queryFn: () => getNotificationBySessionIdAction(type, number),
    enabled: !!userId || !!type || !!number,
    retry: 0,
    refetchOnWindowFocus: false,
  });
};
