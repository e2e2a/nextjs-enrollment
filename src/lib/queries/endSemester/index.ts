import { EndSemesterAction } from '@/action/endSemester';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCollegeEndSemesterMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => EndSemesterAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Enrollment'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentById'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByUserId'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentSetup'] });
    },
  });
};
