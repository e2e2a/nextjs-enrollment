import { archiveBlockTypeAction } from '@/action/blocks/archive';
import { retrieveBlockTypeAction } from '@/action/blocks/retrieve';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Archive Block retrieve mutation
 * @returns Queries and mutations
 */
export const useRetrieveBlockMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => retrieveBlockTypeAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['BlockTypeById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCourseId', data.courseId] });

        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [
              { key1: 'BlockTypeByCategory', key2: data.category },
              { key1: 'BlockTypeById', key2: data.id },
              { key1: 'BlockTypeByCourseId', key2: data.courseId },
            ],
          },
        });
      }
    },
  });
};
