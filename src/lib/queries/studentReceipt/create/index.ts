import { createStudentReceiptAction } from '@/action/studentReceipt/create';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useStudentReceiptMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createStudentReceiptAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['StudentReceiptByUserId', data.userId] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentBySessionId', data.userId] });
        queryClient.invalidateQueries({ queryKey: ['StudentReceiptByCategory', data.category] });
      }
    },
  });
};
