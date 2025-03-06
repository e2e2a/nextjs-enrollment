import { retrieveRoomAction } from '@/action/rooms/retrieve';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Room retrieve mutation
 * @returns Queries and mutations
 */
export const useRetrieveRoomMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => retrieveRoomAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['RoomById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['RoomsByEduLevel', data.level] });
      }
    },
  });
};
