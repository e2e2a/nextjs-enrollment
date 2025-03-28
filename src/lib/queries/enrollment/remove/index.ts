import { removeStudentScheduleAction } from '@/action/enrollment/remove';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Admin Enrollment
 * @returns Queries and mutations
 */
export const useRemoveStudentScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => removeStudentScheduleAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['Enrollment'] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentById', data.id] });

        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [
              { key1: 'Enrollment', key2: '' },
              { key1: 'EnrollmentById', key2: data.id },
            ],
          },
        });
      }
    },
  });
};
