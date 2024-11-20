import { updateCurriculumLayerAction } from '@/action/curriculum/update/curriculum';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateCurriculumLayerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateCurriculumLayerAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['CurriculumById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['CurriculumByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['CurriculumByCourseId', data.courseId] });
      }
    },
  });
};
