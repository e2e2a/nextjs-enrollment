import { getRoomByIdAction } from '@/action/rooms/get/id';
import { useQuery } from '@tanstack/react-query';

export const useRoomQueryById = (id: string) => {
  return useQuery<any, Error>({
    queryKey: ['RoomById', id],
    enabled: !!id,
    queryFn: () => getRoomByIdAction(id),
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
