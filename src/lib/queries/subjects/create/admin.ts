import { createNewSubjectAction } from '@/action/subjects/create/admin';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateSubjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createNewSubjectAction(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['SubjectByCategory', data.category] });
    },
  });
};
