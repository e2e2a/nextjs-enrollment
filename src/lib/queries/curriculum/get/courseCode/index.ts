import { getCurriculumByCourseCodeAction } from '@/action/curriculum/get/courseCode';
import { useQuery } from '@tanstack/react-query';

export const useCurriculumQueryByCourseCode = (courseCode: string) => {
  return useQuery<any, Error>({
    queryKey: ['CurriculumByCourseByCourseCode', courseCode],
    queryFn: () => getCurriculumByCourseCodeAction(courseCode),
    retry: 0,
    enabled: !!courseCode,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
