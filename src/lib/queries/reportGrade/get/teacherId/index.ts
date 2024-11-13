import { getReportGradeByTeacherIdAction } from '@/action/reportGrade/get/teacherId';
import { useQuery } from '@tanstack/react-query';

export const useReportGradeQueryByTeacherId = (teacherId: string) => {
  return useQuery<any, Error>({
    queryKey: ['ReportGradeByTeacherId', teacherId],
    queryFn: async () => await getReportGradeByTeacherIdAction(teacherId),
    enabled: !!teacherId,
    retry: 0,
    refetchOnWindowFocus: false,
  });
};
