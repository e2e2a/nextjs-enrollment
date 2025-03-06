import { archiveCourseAction } from '@/action/courses/archive';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Course Archive Mutation
 * @returns Queries and mutations
 */
export const useArchiveCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => archiveCourseAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['CurriculumById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['CourseByCategory', data.category] });
      }
    },
  });
};
