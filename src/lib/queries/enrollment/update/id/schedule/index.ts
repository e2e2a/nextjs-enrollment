import { updateStudentEnrollmentScheduleAction } from '@/action/enrollment/update/id/schedule';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateStudentEnrollmentScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateStudentEnrollmentScheduleAction(data),
    onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['Enrollment'] });
    //   queryClient.invalidateQueries({ queryKey: ['EnrollmentById'] });
    },
  });
};
