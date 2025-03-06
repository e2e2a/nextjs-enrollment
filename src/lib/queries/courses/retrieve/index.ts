import { retrieveCourseAction } from '@/action/courses/retrieve';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Course Retrieve Mutation
 * @returns Queries and mutations
 */
export const useRetrieveCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => retrieveCourseAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['CurriculumById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['CourseByCategory', data.category] });
      }
    },
  });
};
