import { archiveSubjectByIdAction } from '@/action/subjects/archive';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useArchiveSubjectByIdMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => archiveSubjectByIdAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['SubjectById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['SubjectByCategory', data.category] });
      }
    },
  });
};
