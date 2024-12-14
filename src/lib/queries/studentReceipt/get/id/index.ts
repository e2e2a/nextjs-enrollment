import { getAllStudentReceiptByIdAction } from '@/action/studentReceipt/get/id';
import { useQuery } from '@tanstack/react-query';

export const useStudentReceiptQueryById = (id: string) => {
  return useQuery<any, Error>({
    queryKey: ['StudentReceiptById', id],
    queryFn: () => getAllStudentReceiptByIdAction(id),
    enabled: !!id,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
