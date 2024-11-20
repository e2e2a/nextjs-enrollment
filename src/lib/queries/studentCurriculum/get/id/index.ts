import { getStudentCurriculumByIdAction } from '@/action/studentCurrirulum/get/id';
import { useQuery } from '@tanstack/react-query';

export const useStudentCurriculumQueryById = (id: any) => {
  return useQuery<any, Error>({
    queryKey: ['StudentCurriculumById', id],
    queryFn: () => getStudentCurriculumByIdAction(id),
    retry: 0,
    enabled: !!id,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
