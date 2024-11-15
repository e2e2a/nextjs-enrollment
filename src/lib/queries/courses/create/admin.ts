import { createCourseAction } from '@/action/courses/create/admin';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createCourseAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['Curriculum'] });
        queryClient.invalidateQueries({ queryKey: ['CourseByCategory', data.category] });
      }
    },
  });
};
