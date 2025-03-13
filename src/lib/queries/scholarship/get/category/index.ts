import { getScholarshipByCategoryAction } from '@/action/scholarship/get/category';
import { useQuery } from '@tanstack/react-query';

export const useScholarshipQueryByCategory = (category: string) => {
  return useQuery<any, Error>({
    queryKey: ['ScholarshipByCategory', category],
    queryFn: () => getScholarshipByCategoryAction(category),
    enabled: !!category,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
