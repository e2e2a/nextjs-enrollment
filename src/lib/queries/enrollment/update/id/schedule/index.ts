import { updateStudentEnrollmentScheduleAction } from '@/action/enrollment/update/id/schedule';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateStudentEnrollmentScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateStudentEnrollmentScheduleAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['EnrollmentById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCourseId', data.courseId] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['AllEnrollmentByCourseId', data.courseId] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentBySessionId', data.userId] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentStepByCategory', `${data.category}-${data.step}`] });

        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [
              { key1: 'ProfileBySessionId', key2: '' },
              { key1: 'BlockTypeByCategory', key2: data.category },
              { key1: 'BlockTypeByCourseId', key2: data.courseId },
              { key1: 'EnrollmentByCategory', key2: data.category },
              { key1: 'AllEnrollmentByCourseId', key2: data.courseId },
              { key1: 'EnrollmentByProfileId', key2: data.profileId },
              { key1: 'EnrollmentBySessionId', key2: data.userId },
              { key1: 'EnrollmentStepByCategory', key2: `${data.category}-${data.prevStep}` },
            ],
          },
        });
      }
    },
  });
};
