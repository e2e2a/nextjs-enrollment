import { createScholarshipAction } from '@/action/scholarship/create';
import { updateScholarshipAction } from '@/action/scholarship/update/id';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateScholarshipMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateScholarshipAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['ScholarshipByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['ScholarshipById', data.id] });
      }
    },
  });
};
