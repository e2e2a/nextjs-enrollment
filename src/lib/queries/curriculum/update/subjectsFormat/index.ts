import { updateCurriculumSubjectsAction } from '@/action/curriculum/update/subjectsFormat';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateCurriculumLayerSubjectsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateCurriculumSubjectsAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['CurriculumById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['CurriculumByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['CurriculumByCourseId', data.courseId] });
      }
    },
  });
};
