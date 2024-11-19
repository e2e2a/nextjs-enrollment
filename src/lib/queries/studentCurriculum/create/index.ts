import { createStudentCurriculumAction } from "@/action/studentCurrirulum/create";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateStudentCurriculumMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, any>({
      mutationFn: async (data) => createStudentCurriculumAction(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['StudentCurriculum'] });
        queryClient.invalidateQueries({ queryKey: ['StudentCurriculumById'] });
      },
    });
  };