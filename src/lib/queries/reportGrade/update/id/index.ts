import { updateReportGradeAction } from '@/action/reportGrade/update/id';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateGradeReportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => await updateReportGradeAction(data),
    onSuccess: async (data) => {
      console.log('data passed', data.teacherId);
        queryClient.invalidateQueries({ queryKey: ['ReportGradeByCategory', data.category] });
      queryClient.invalidateQueries({ queryKey: ['ReportGradeByTeacherId', data.teacherId] });
    },
  });
};
