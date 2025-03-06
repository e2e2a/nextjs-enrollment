import { archiveBlockTypeAction } from '@/action/blocks/archive';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Archive Block archive mutation
 * @returns Queries and mutations
 */
export const useArchiveBlockMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => archiveBlockTypeAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['BlockTypeById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCourseId', data.courseId] });
      }
    },
  });
};
