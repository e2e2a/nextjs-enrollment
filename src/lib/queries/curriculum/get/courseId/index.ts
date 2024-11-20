import { getCurriculumByCourseIdAction } from '@/action/curriculum/get/courseId';
import { useQuery } from '@tanstack/react-query';

export const useCurriculumQueryByCourseId = (courseId: any) => {
  return useQuery<any, Error>({
    queryKey: ['CurriculumByCourseId', courseId],
    queryFn: () => getCurriculumByCourseIdAction(courseId),
    retry: 0,
    enabled: !!courseId,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
