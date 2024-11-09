import { getAllBlockTypeByCourseIdAction } from '@/action/blocks/get/courseId';
import { useQuery } from '@tanstack/react-query';

export const useBlockCourseQueryByCourseId = (courseId: string) => {
  return useQuery<any, Error>({
    queryKey: ['BlockTypeByCourseId', courseId],
    queryFn: () => getAllBlockTypeByCourseIdAction(courseId),
    enabled: !!courseId,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
