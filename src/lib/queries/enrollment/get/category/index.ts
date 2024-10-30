import { getEnrollmentByCategoryAction } from '@/action/enrollment/get/category';
import { useQuery } from '@tanstack/react-query';

export const useEnrollmentQueryByCategory = (category: string) => {
  return useQuery<any, Error>({
    queryKey: ['EnrollmentByCategory', category],
    queryFn: () => getEnrollmentByCategoryAction(category),
    enabled: !!category,
    retry: 0,
    refetchOnWindowFocus: false,
  });
};
