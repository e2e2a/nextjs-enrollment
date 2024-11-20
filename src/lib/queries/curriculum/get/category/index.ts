import { getCurriculumByCategoryAction } from '@/action/curriculum/get/category';
import { useQuery } from '@tanstack/react-query';

export const useCurriculumQueryByCategory = (category: string) => {
  return useQuery<any, Error>({
    queryKey: ['CurriculumByCategory', category],
    queryFn: () => getCurriculumByCategoryAction(category),
    enabled: !!category,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
