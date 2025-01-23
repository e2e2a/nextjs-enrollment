import { getCourseByIdAction } from '@/action/courses/get/id';
import { useQuery } from '@tanstack/react-query';

export const useCourseQueryById = (id: string) => {
  return useQuery<any, Error>({
    queryKey: ['CourseById', id],
    queryFn: () => getCourseByIdAction(id),
    retry: 0,
    enabled: !!id,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
