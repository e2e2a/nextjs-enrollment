import { editTeacherScheduleAction } from '@/action/teacherSchedule/update';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useEditTeacherScheduleByCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => editTeacherScheduleAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByCategory', data.category] });

        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [
              { key1: 'TeacherScheduleById', key2: data.id },
              { key1: 'TeacherScheduleByCategory', key2: data.category },
            ],
          },
        });
      }
    },
  });
};
