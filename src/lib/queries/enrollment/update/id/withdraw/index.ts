import { updateEnrollmentStepAction } from '@/action/enrollment/update/id/step';
import { updateEnrollmentWithdrawAction } from '@/action/enrollment/update/id/withdraw';
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
        console.log('data')
        queryClient.invalidateQueries({ queryKey: ['NotificationBySessionId'] });
        queryClient.invalidateQueries({ queryKey: ['NotificationBySessionId', data.id, 'FRESH', 0] }); // @todo broadcast
        queryClient.invalidateQueries({ queryKey: ['NotificationBySessionId', data.id, 'OLD', 0] }); // @todo broadcast
      }
    },
  });
};
