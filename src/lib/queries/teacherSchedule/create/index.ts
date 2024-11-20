import { createTeacherScheduleAction } from '@/action/teacherSchedule/create';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateTeacherScheduleByCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createTeacherScheduleAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByCategory', data.category] });
      }
    },
  });
};
