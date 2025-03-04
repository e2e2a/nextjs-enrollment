import { archiveCourseBlockScheduleAction } from '@/action/blocks/archive';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Archive Block schedule mutation
 * @returns Queries and mutations
 */
export const useArchiveCourseBlockScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => archiveCourseBlockScheduleAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['BlockTypeById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCourseId', data.courseId] });
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByProfileId', data.profileId] });
      }
    },
  });
};
