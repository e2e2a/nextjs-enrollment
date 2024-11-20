import { createCollegeCourseBlockAction } from '@/action/blocks/create/admin';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateCourseBlockMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createCollegeCourseBlockAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCourseId', data.courseId] });
      }
    },
  });
};
