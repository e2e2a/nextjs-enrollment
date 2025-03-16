import { getAllStudentReceiptByUserIdAction } from '@/action/studentReceipt/get/userId';
import { useQuery } from '@tanstack/react-query';

export const useStudentReceiptQueryByUserId = (userId: string, schoolYear?: string) => {
  return useQuery<any, Error>({
    queryKey: ['StudentReceiptByUserId', userId],
    queryFn: () => getAllStudentReceiptByUserIdAction(userId, schoolYear),
    enabled: !!userId && !!schoolYear,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
