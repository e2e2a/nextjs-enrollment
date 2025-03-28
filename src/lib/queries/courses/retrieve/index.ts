import { retrieveCourseAction } from '@/action/courses/retrieve';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Course Retrieve Mutation
 * @returns Queries and mutations
 */
export const useRetrieveCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => retrieveCourseAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['CurriculumById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['CourseByCategory', data.category] });

        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [
              { key1: 'CurriculumById', key2: data.id },
              { key1: 'CourseByCategory', key2: data.category },
            ],
          },
        });
      }
    },
  });
};
