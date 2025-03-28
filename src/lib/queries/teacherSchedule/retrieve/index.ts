import { retrieveTeacherScheduleCollegeAction } from '@/action/teacherSchedule/retrieve';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Teacher Schedule Retrieve Management
 * @returns Queries and mutations
 */
export const useRetrieveTeacherScheduleCollegeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => retrieveTeacherScheduleCollegeAction(data),
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
