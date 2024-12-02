import { getAllDownPaymentByCategory } from '@/action/downPayment/get/category';
import { useQuery } from '@tanstack/react-query';

export const useDownPaymentQueryByCategory = (category: string) => {
  return useQuery<any, Error>({
    queryKey: ['DownPaymentByCategory', category],
    queryFn: () => getAllDownPaymentByCategory(category),
    retry: 0,
    enabled: !!category,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
