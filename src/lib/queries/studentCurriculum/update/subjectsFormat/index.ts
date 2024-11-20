import { updateStudentCurriculumSubjectsAction } from '@/action/studentCurrirulum/update/subjectsFormat';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateStudentCurriculumLayerSubjectsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateStudentCurriculumSubjectsAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['StudentCurriculumById', data.id] }); // @todo broadcast
      }
    },
  });
};
