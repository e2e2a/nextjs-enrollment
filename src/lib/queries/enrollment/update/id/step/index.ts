import { updateEnrollmentStepAction } from '@/action/enrollment/update/id/step';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateEnrollmentStepMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateEnrollmentStepAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        /**
         * @todo start
         */
        queryClient.invalidateQueries({ queryKey: ['EnrollmentByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['AllEnrollmentByCourseId', data.courseId] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentByProfileId', data.profileId] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentBySessionId', data.userId] });
        /**
         * @todo end
         */
        if (data.prevStep) queryClient.invalidateQueries({ queryKey: ['EnrollmentStepByCategory', `${data.category}-${data.prevStep}`] });
        if (data.nextStep) queryClient.invalidateQueries({ queryKey: ['EnrollmentStepByCategory', `${data.category}-${data.prevStep}`] });
      }
    },
  });
};
