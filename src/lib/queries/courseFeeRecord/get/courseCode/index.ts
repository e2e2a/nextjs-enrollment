import { getCourseFeeRecordByCourseCodeAndYearAndSemesterAction } from '@/action/courseFeeRecord/get/courseCode';
import { useQuery } from '@tanstack/react-query';

export const useCourseFeeRecordQueryByCourseCodeAndYearAndSemester = (year: string, semester: string, courseCode: string) => {
  return useQuery<any, Error>({
    queryKey: ['CourseFeeRecordByCourseCode', `${courseCode}-${semester}-${year}`],
    queryFn: () => getCourseFeeRecordByCourseCodeAndYearAndSemesterAction(year, semester, courseCode),
    retry: 0,
    enabled: !!courseCode || !!year || !!semester,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
