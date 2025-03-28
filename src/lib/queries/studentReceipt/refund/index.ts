import { createStudentReceiptAction } from '@/action/studentReceipt/create';
import { refundStudentReceiptAction } from '@/action/studentReceipt/refund';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useRefundStudentReceiptMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => refundStudentReceiptAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['StudentReceiptByUserId', data.userId] });
        queryClient.invalidateQueries({ queryKey: ['StudentReceiptByUserIdAndYearAndSemester'] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentBySessionId', data.userId] });
        queryClient.invalidateQueries({ queryKey: ['StudentReceiptByCategory', data.category] });

        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [
              { key1: 'StudentReceiptByUserId', key2: data.userId },
              { key1: 'StudentReceiptByUserIdAndYearAndSemester', key2: '' },
              { key1: 'EnrollmentBySessionId', key2: data.userId },
              { key1: 'StudentReceiptByCategory', key2: data.courseId },
            ],
          },
        });
      }
    },
  });
};
