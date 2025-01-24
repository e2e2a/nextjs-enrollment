import { updateSubjectByIdAction } from '@/action/subjects/update/id';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateSubjectByIdMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateSubjectByIdAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['SubjectById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['SubjectByCategory', data.category] });
      }
    },
  });
};
