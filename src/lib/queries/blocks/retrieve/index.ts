import { archiveBlockTypeAction } from '@/action/blocks/archive';
import { retrieveBlockTypeAction } from '@/action/blocks/retrieve';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Archive Block retrieve mutation
 * @returns Queries and mutations
 */
export const useRetrieveBlockMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => retrieveBlockTypeAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['BlockTypeById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCourseId', data.courseId] });
      }
    },
  });
};
