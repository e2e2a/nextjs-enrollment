import { createCollegeCourseBlockAction } from '@/action/blocks/create';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateCourseBlockMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createCollegeCourseBlockAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCourseId', data.courseId] });

        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [
              { key1: 'BlockTypeByCategory', key2: data.category },
              { key1: 'BlockTypeByCourseId', key2: data.courseId },
            ],
          },
        });
      }
    },
  });
};
