import { archiveTeacherScheduleCollegeAction } from '@/action/teacherSchedule/archive';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Admin Teacher Schedule Management
 * @returns Queries and mutations
 */
export const useArchiveTeacherScheduleCollegeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => archiveTeacherScheduleCollegeAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['TeacherSchedule'] });
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByProfileId'] });
      }
    },
  });
};
