import { updateCourseBlockScheduleAction } from '@/action/blocks/update';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateCourseBlockScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateCourseBlockScheduleAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['BlockTypeById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCourseId', data.courseId] });
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByCategory', data.category] });
        if (data.ts && data.ts.length > 0) {
          for (const item of data.ts) {
            queryClient.invalidateQueries({ queryKey: ['useEnrollmentQueryByTeacherScheduleId', { id: item.teacherScheduleId, category: data.category }] }); // @todo broadcast
            queryClient.invalidateQueries({ queryKey: ['TeacherScheduleById', item.teacherScheduleId] }); // @todo broadcast
            await supabase.channel('global-channel').send({
              type: 'broadcast',
              event: 'invalidate-query',
              payload: {
                queryKeys: [
                  { key1: 'useEnrollmentQueryByTeacherScheduleId' }, // @Bug @cant fixed
                  { key1: 'TeacherScheduleById', key2: item.teacherScheduleId },
                ],
              },
            });
          }
        }

        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [
              { key1: 'BlockTypeById', key2: data.id },
              { key1: 'BlockTypeByCourseId', key2: data.courseId },
              { key1: 'TeacherScheduleByCategory', key2: data.category },
            ],
          },
        });
      }
    },
  });
};
