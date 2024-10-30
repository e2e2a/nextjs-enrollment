import { createEnrollmentByCategoryAction } from '@/action/enrollment/create';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateEnrollmentByCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createEnrollmentByCategoryAction(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['userProfile'] });
      queryClient.refetchQueries({ queryKey: ['Enrollment'] });
      queryClient.refetchQueries({ queryKey: ['EnrollmentByStep'] });
    },
  });
};
