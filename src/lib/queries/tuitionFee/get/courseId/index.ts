import { getAllTuitionFeeByCourseIdAction } from '@/action/tuitionFee/get/courseId';
import { useQuery } from '@tanstack/react-query';

export const useTuitionFeeQueryByCourseId = (courseId: string) => {
  return useQuery<any, Error>({
    queryKey: ['TuitionFeeByCourseId', courseId],
    queryFn: () => getAllTuitionFeeByCourseIdAction(courseId),
    retry: 0,
    enabled: !!courseId,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
