import { createTuitionFeeAction } from '@/action/courseFee/create';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreatTuitionFeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createTuitionFeeAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['TuitionFeeByCategory', data.category] });

        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [{ key1: 'TuitionFeeByCategory', key2: data.category }],
          },
        });
      }
    },
  });
};
