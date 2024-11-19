import { getStudentCurriculumByStudentIdAction } from '@/action/studentCurrirulum/get/studentId';
import { useQuery } from '@tanstack/react-query';

export const useStudentCurriculumQueryByStudentId = (studentId: any) => {
  return useQuery<any, Error>({
    queryKey: ['StudentCurriculumByStudentId', studentId],
    queryFn: () => getStudentCurriculumByStudentIdAction(studentId),
    retry: 0,
    enabled: !!studentId,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
