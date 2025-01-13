import { getNotificationBySessionIdAction } from '@/action/notifications/get/session';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook query Notification by session id.
 *
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */
export const useNotificationQueryBySessionId = (userId: string, get: number) => {
  return useQuery<any, Error>({
    queryKey: ['NotificationBySessionId', `${userId}-${get}`],
    queryFn: () => getNotificationBySessionIdAction(get),
    enabled: !!userId || !!get,
    retry: 0,
    refetchOnWindowFocus: false,
  });
};
