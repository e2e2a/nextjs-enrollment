import { getEnrollmentRecordByCategoryAction } from '@/action/enrollmentRecord/get/category';
import { useQuery } from '@tanstack/react-query';

export const useEnrollmentRecordQueryByCategory = (category: string) => {
  return useQuery<any, Error>({
    queryKey: ['EnrollmentRecordByCategory', category],
    queryFn: () => getEnrollmentRecordByCategoryAction(category),
    enabled: !!category,
    retry: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
