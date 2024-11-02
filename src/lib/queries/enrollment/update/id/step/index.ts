import { updateEnrollmentStepAction } from '@/action/enrollment/update/id/step';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateEnrollmentStepMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateEnrollmentStepAction(data),
    onSuccess: async (data) => {
        // data.prevStep !== 1 ? data.prevStep : undefined
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByStep'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByStep'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentById'] });
    },
  });
};
