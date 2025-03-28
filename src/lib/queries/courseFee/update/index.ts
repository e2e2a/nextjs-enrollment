import { updateTuitionFeeAction } from '@/action/courseFee/update';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateTuitionFeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateTuitionFeeAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['TuitionFeeByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['TuitionFeeById', data.id] });

        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [
              { key1: 'TuitionFeeByCategory', key2: data.category },
              { key1: 'TuitionFeeById', key2: data.id },
            ],
          },
        });
      }
    },
  });
};
