import { getStudentCurriculumByCategoryAction } from '@/action/studentCurrirulum/get/category';
import { useQuery } from '@tanstack/react-query';

export const useStudentCurriculumQueryByCategory = (category: string) => {
  return useQuery<any, Error>({
    queryKey: ['StudentCurriculumByCategory', category],
    queryFn: () => getStudentCurriculumByCategoryAction(category),
    enabled: !!category,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
