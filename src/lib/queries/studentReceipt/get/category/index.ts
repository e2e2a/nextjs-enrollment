import { getAllStudentReceiptByCategoryAction } from '@/action/studentReceipt/get/category';
import { useQuery } from '@tanstack/react-query';

export const useStudentReceiptQueryByCategory = (category: string) => {
  return useQuery<any, Error>({
    queryKey: ['StudentReceiptByCategory', category],
    queryFn: () => getAllStudentReceiptByCategoryAction(category),
    enabled: !!category,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
