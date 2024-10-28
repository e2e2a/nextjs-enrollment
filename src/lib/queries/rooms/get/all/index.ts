import { getAllRoomByEduLevelAction } from '@/action/rooms/get/all';
import { useQuery } from '@tanstack/react-query';

export const useAllRoomQueryByEduLevel = (level: string) => {
  return useQuery<any, Error>({
    queryKey: ['RoomsByEduLevel', level],
    queryFn: () => getAllRoomByEduLevelAction(level),
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
