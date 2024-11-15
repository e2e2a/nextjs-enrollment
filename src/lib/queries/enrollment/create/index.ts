import { createEnrollmentByCategoryAction } from '@/action/enrollment/create';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateEnrollmentByCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createEnrollmentByCategoryAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        console.log('passed', data);

        // @todo this query must have the id to be identified which of the authenticated student will be invalidated
        queryClient.invalidateQueries({ queryKey: ['ProfileBySessionId'] });
        // end todo

        queryClient.invalidateQueries({ queryKey: ['EnrollmentByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['AllEnrollmentByCourseId', data.courseId] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentByProfileId', data.profileId] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentBySessionId', data.userId] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentStepByCategory'] });
      }
    },
  });
};
