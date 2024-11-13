import { updateReportGradeAction } from '@/action/reportGrade/update/id';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateGradeReportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => await updateReportGradeAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        console.log('passed');
        queryClient.invalidateQueries({ queryKey: ['ReportGradeById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['ReportGradeByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['ReportGradeByTeacherId', data.teacherId] });
      }
    },
  });
};
