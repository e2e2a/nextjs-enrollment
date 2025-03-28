import { updateEnrollmentSetupAction } from '@/action/enrollmentSetup/update';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateEnrollmentSetupMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateEnrollmentSetupAction(data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['EnrollmentSetup'] }); // @todo broadcast

      await supabase.channel('global-channel').send({
        type: 'broadcast',
        event: 'invalidate-query',
        payload: {
          queryKeys: [{ key1: 'EnrollmentSetup', key2: '' }],
        },
      });
    },
  });
};
