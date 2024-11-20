import { createEnrollmentContinuingAction } from '@/action/college/enrollment/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useEnrollmentContinuingStep0Mutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createEnrollmentContinuingAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['Enrollment'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByStep'] });
    },
  });
};
