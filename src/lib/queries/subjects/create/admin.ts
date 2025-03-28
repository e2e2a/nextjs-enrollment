import { createNewSubjectAction } from '@/action/subjects/create/admin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export const useCreateSubjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createNewSubjectAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['SubjectByCategory', data.category] });

        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [{ key1: 'SubjectByCategory', key2: data.category }],
          },
        });
      }
    },
  });
};
