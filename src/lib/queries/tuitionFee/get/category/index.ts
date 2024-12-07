import { getAllTuitionFeeByCategoryAction } from '@/action/tuitionFee/get/category';
import { useQuery } from '@tanstack/react-query';

export const useTuitionFeeQueryByCategory = (category: string) => {
  return useQuery<any, Error>({
    queryKey: ['TuitionFeeByCategory', category],
    queryFn: () => getAllTuitionFeeByCategoryAction(category),
    retry: 0,
    enabled: !!category,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
