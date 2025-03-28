import { archiveTeacherScheduleCollegeAction } from '@/action/teacherSchedule/archive';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Teacher Schedule Archive Management
 * @returns Queries and mutations
 */
export const useArchiveTeacherScheduleCollegeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => archiveTeacherScheduleCollegeAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['TeacherSchedule'] });
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByProfileId'] });

        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [
              { key1: 'TeacherSchedule', key2: '' },
              { key1: 'TeacherScheduleByCategory', key2: data.category },
              { key1: 'TeacherScheduleByProfileId', key2: '' },
            ],
          },
        });
      }
    },
  });
};
