import { updateCourseByIdAction } from '@/action/courses/update/id';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateCourseByIdMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateCourseByIdAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['CurriculumById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['CourseByCategory', data.category] });
      }
    },
  });
};
