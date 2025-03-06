import { retrieveTeacherScheduleCollegeAction } from '@/action/teacherSchedule/retrieve';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Teacher Schedule Retrieve Management
 * @returns Queries and mutations
 */
export const useRetrieveTeacherScheduleCollegeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => retrieveTeacherScheduleCollegeAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['TeacherSchedule'] });
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByProfileId'] });
      }
    },
  });
};
