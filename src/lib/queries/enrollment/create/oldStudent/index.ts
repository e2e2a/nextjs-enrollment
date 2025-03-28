import { createEnrollmentForOldStudentByCategoryAction } from '@/action/enrollment/create/oldStudent';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateEnrollmentForOldStudentByCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createEnrollmentForOldStudentByCategoryAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        // @todo this query must have the id to be identified which of the authenticated student will be invalidated
        queryClient.invalidateQueries({ queryKey: ['ProfileBySessionId'] });
        // end todo

        queryClient.invalidateQueries({ queryKey: ['EnrollmentByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['AllEnrollmentByCourseId', data.courseId] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentByProfileId', data.profileId] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentBySessionId', data.userId] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentStepByCategory', `${data.category}-${data.prevStep}`] }); // @todo broadcast

        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [
              { key1: 'ProfileBySessionId', key2: '' },
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
