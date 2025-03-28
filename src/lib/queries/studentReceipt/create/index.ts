import { createStudentReceiptAction } from '@/action/studentReceipt/create';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateStudentReceiptMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createStudentReceiptAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['StudentReceiptByUserId', data.userId] });
        queryClient.invalidateQueries({ queryKey: ['StudentReceiptByUserIdAndYearAndSemester'] });
        // queryClient.invalidateQueries({ queryKey: ['StudentReceiptByUserIdAndYearAndSemester', data.userId] });
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
