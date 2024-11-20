import { createStudentCurriculumAction } from '@/action/studentCurrirulum/create';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateStudentCurriculumMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createStudentCurriculumAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['StudentCurriculumByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['StudentCurriculumByStudentId', data.studentId] });
      }
    },
  });
};
