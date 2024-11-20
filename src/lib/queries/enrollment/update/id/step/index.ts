import { updateEnrollmentStepAction } from '@/action/enrollment/update/id/step';
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
      }
    },
  });
};
