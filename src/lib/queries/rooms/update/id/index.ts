import { updateRoomByIdAction } from '@/action/rooms/update/id';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateRoomByIdMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateRoomByIdAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['RoomsByEduLevel', data.level] });
      }
    },
  });
};
