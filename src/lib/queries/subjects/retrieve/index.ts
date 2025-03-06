import { retrieveSubjectByIdAction } from '@/action/subjects/retrieve';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Subject retrieve mutation
 * @returns Queries and mutations
 */
export const useRetrieveSubjectByIdMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => retrieveSubjectByIdAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['SubjectById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['SubjectByCategory', data.category] });
      }
    },
  });
};
