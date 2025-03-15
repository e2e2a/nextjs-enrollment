import { getCourseFeeByCourseIdAndYearAction } from '@/action/courseFee/get/courseId';
import { useQuery } from '@tanstack/react-query';

export const useCourseFeeQueryByCourseIdAndYear = (year: string, courseId: string) => {
  return useQuery<any, Error>({
    queryKey: ['TuitionFeeByCourseId', `${courseId} - ${year}`],
    queryFn: () => getCourseFeeByCourseIdAndYearAction(year, courseId),
    retry: 0,
    enabled: !!courseId || !!year,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
