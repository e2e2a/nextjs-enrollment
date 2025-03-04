import { removeStudentScheduleAction } from '@/action/enrollment/remove';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Admin Enrollment
 * @returns Queries and mutations
 */
export const useRemoveStudentScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => removeStudentScheduleAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['Enrollment'] });
        queryClient.invalidateQueries({ queryKey: ['EnrollmentById', data.id] });
      }
    },
  });
};
