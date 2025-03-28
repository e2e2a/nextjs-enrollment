import { updateEnrollmentStepAction } from '@/action/enrollment/update/id/step';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateEnrollmentStepMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateEnrollmentStepAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['EnrollmentByCategory', data.category] }); // @todo broadcast
        queryClient.invalidateQueries({ queryKey: ['AllEnrollmentByCourseId', data.courseId] }); // @todo broadcast
        if (data.profileId) queryClient.invalidateQueries({ queryKey: ['EnrollmentByProfileId', data.profileId] }); // @todo broadcast
        queryClient.invalidateQueries({ queryKey: ['EnrollmentBySessionId', data.userId] }); // @todo broadcast

        if (data.prevStep) queryClient.invalidateQueries({ queryKey: ['EnrollmentStepByCategory', `${data.category}-${data.prevStep}`] });
        if (data.nextStep) queryClient.invalidateQueries({ queryKey: ['EnrollmentStepByCategory', `${data.category}-${data.prevStep}`] });
        queryClient.invalidateQueries({ queryKey: ['NotificationBySessionId'] });
        queryClient.invalidateQueries({ queryKey: ['NotificationBySessionId', data.userId, 'FRESH', 0] }); // @todo broadcast
        queryClient.invalidateQueries({ queryKey: ['NotificationBySessionId', data.userId, 'OLD', 0] }); // @todo broadcast

        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [
              { key1: 'EnrollmentByCategory', key2: data.category },
              { key1: 'AllEnrollmentByCourseId', key2: data.courseId },
              { key1: 'EnrollmentByProfileId', key2: data.profileId },
              { key1: 'EnrollmentBySessionId', key2: data.userId },
              { key1: 'EnrollmentStepByCategory', key2: '' },
              { key1: 'NotificationBySessionId', key2: `` },
            ],
          },
        });
      }
    },
  });
};
