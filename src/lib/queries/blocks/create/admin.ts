import { createCollegeCourseBlockAction } from '@/action/blocks/create/admin';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateCourseBlockMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createCollegeCourseBlockAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['BlockType'] });
      queryClient.invalidateQueries({ queryKey: ['BlockTypeById'] });
    },
  });
};
