import { editTeacherScheduleAction } from '@/action/teacherSchedule/update';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useEditTeacherScheduleByCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => editTeacherScheduleAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByCategory', data.category] });
      }
    },
  });
};
