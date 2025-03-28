import { archiveCourseBlockScheduleAction } from '@/action/blocks/archive/schedule';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Archive Block schedule removed mutation
 * @returns Queries and mutations
 */
export const useArchiveCourseBlockScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => archiveCourseBlockScheduleAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['BlockTypeById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCourseId', data.courseId] });
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByProfileId', data.profileId] });

        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [
              { key1: 'BlockTypeByCategory', key2: data.category },
              { key1: 'BlockTypeById', key2: data.id },
              { key1: 'BlockTypeByCourseId', key2: data.courseId },
              { key1: 'TeacherScheduleByCategory', key2: data.category },
              { key1: 'TeacherScheduleByProfileId', key2: data.profileId },
            ],
          },
        });
      }
    },
  });
};
