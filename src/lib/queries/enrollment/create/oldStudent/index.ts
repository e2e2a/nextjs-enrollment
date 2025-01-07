import { createEnrollmentForOldStudentByCategoryAction } from '@/action/enrollment/create/oldStudent';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateEnrollmentForOldStudentByCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createEnrollmentForOldStudentByCategoryAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        // @todo this query must have the id to be identified which of the authenticated student will be invalidated
        queryClient.invalidateQueries({ queryKey: ['ProfileBySessionId'] });
        // end todo

        queryClient.invalidateQueries({ queryKey: ['EnrollmentByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['AllEnrollmentByCourseId', data.courseId] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentByProfileId', data.profileId] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentBySessionId', data.userId] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentStepByCategory', `${data.category}-${data.prevStep}`] }); // @todo broadcast
      }
    },
  });
};
