import { archiveRoomAction } from '@/action/rooms/archive';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Room Archive mutation
 * @returns Queries and mutations
 */
export const useArchiveRoomMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => archiveRoomAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['RoomById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['RoomsByEduLevel', data.level] });
      }
    },
  });
};
