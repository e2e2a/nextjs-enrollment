import { getAllBlockTypeAction } from '@/action/blocks/get/all';
import { useQuery } from '@tanstack/react-query';

export const useBlockCourseQuery = () => {
  return useQuery<any, Error>({
    queryKey: ['BlockType'],
    queryFn: () => getAllBlockTypeAction(),
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
