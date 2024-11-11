import { createReportGradeAction } from '@/action/reportGrade/create';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateGradeReportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createReportGradeAction(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ReportGrade', data.category] });
      queryClient.invalidateQueries({ queryKey: ['TeacherReportGradeById'] });
    },
  });
};
