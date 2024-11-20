import { updateStudentCurriculumLayerAction } from '@/action/studentCurrirulum/update/curriculum';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateStudentCurriculumLayerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateStudentCurriculumLayerAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['StudentCurriculumById', data.id] });
      }
    },
  });
};
