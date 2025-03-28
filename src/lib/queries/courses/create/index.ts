import { createCourseAction } from '@/action/courses/create';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export const useCreateCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createCourseAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['CurriculumByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['CourseByCategory', data.category] });

        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [
              { key1: 'CurriculumByCategory', key2: data.category },
              { key1: 'CourseByCategory', key2: data.category },
            ],
          },
        });
      }
    },
  });
};
