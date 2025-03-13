import { createScholarshipAction } from '@/action/scholarship/create';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateScholarshipMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createScholarshipAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['SubjectByCategory', data.category] });
      }
    },
  });
};
