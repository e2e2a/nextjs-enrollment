import { createTeacherScheduleAction } from '@/action/teacherSchedule/create';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateTeacherScheduleByCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createTeacherScheduleAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByCategory', data.category] });

        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [{ key1: 'TeacherScheduleByCategory', key2: data.category }],
          },
        });
      }
    },
  });
};
