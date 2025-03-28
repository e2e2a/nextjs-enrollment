import { updateEnrollmentStepAction } from '@/action/enrollment/update/id/step';
import { updateEnrollmentWithdrawAction } from '@/action/enrollment/update/id/withdraw';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useEnrollmentWithdrawMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateEnrollmentWithdrawAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['EnrollmentByCategory', data.category] }); // @todo broadcast
        queryClient.invalidateQueries({ queryKey: ['AllEnrollmentByCourseId', data.courseId] }); // @todo broadcast
        if (data.profileId) queryClient.invalidateQueries({ queryKey: ['EnrollmentByProfileId', data.profileId] }); // @todo broadcast
        queryClient.invalidateQueries({ queryKey: ['EnrollmentBySessionId', data.id] }); // @todo broadcast

        queryClient.invalidateQueries({ queryKey: ['NotificationBySessionId'] });
        queryClient.invalidateQueries({ queryKey: ['NotificationBySessionId', data.id, 'FRESH', 0] }); // @todo broadcast
        queryClient.invalidateQueries({ queryKey: ['NotificationBySessionId', data.id, 'OLD', 0] }); // @todo broadcast

        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [
              { key1: 'EnrollmentByCategory', key2: data.category },
              { key1: 'AllEnrollmentByCourseId', key2: data.courseId },
              { key1: 'EnrollmentByProfileId', key2: data.profileId },
              { key1: 'EnrollmentBySessionId', key2: data.id },
              { key1: 'EnrollmentStepByCategory', key2: '' },
              { key1: 'NotificationBySessionId', key2: `` },
            ],
          },
        });
      }
    },
  });
};
