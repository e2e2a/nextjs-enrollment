import { updateStudentEnrollmentScheduleAction } from '@/action/enrollment/update/id/schedule';
import { useMutation, useQueryClient } from '@tanstack/react-query';
/**
 * @todo 
 */
export const useUpdateStudentEnrollmentScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateStudentEnrollmentScheduleAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['EnrollmentByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['AllEnrollmentByCourseId', data.courseId] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentByProfileId', data.profileId] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentBySessionId', data.userId] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentStepByCategory', { category: data.category, step: 1 }] });
      }
    },
  });
};
