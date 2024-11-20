import { createRoomAction } from '@/action/rooms/create/admin';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateRoomMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createRoomAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['RoomsByEduLevel', data.level] });
      }
    },
  });
};
