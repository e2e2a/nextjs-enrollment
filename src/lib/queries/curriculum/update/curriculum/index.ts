import { updateCurriculumLayerAction } from '@/action/curriculum/update/curriculum';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateCurriculumLayerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateCurriculumLayerAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['CurriculumById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['CurriculumByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['CurriculumByCourseId', data.courseId] });

        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [
              { key1: 'CurriculumById', key2: data.id },
              { key1: 'CurriculumByCategory', key2: data.category },
              { key1: 'CurriculumByCourseId', key2: data.courseId },
            ],
          },
        });
      }
    },
  });
};
