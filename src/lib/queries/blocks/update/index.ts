import { updateCourseBlockScheduleAction } from '@/action/blocks/update';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateCourseBlockScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateCourseBlockScheduleAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['BlockTypeById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCourseId', data.courseId] });
        if (data.ts && data.ts.length > 0) {
          for (const item of data.ts) {
            queryClient.invalidateQueries({ queryKey: ['TeacherScheduleById', item.teacherScheduleId] }); // @todo broadcast
          }
        }
      }
    },
  });
};
