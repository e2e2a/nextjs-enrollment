import { updateSubjectByIdAction } from '@/action/subjects/update/id';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateSubjectByIdMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateSubjectByIdAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['SubjectById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['SubjectByCategory', data.category] });

        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [
              { key1: 'SubjectById', key2: data.id },
              { key1: 'SubjectByCategory', key2: data.category },
            ],
          },
        });
      }
    },
  });
};
