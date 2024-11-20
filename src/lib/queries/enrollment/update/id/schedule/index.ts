import { updateStudentEnrollmentScheduleAction } from '@/action/enrollment/update/id/schedule';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateStudentEnrollmentScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateStudentEnrollmentScheduleAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        console.log('data', data)
        queryClient.invalidateQueries({ queryKey: ['EnrollmentById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCourseId', data.category] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['AllEnrollmentByCourseId', data.courseId] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentBySessionId', data.userId] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentStepByCategory', `${data.category}-${data.step}`] });
      }
    },
  });
};
