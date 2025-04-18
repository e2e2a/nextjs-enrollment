import { updateReportGradeAction } from '@/action/reportGrade/update/id';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateGradeReportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => await updateReportGradeAction(data),
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['ReportGradeById', data.id] });
        queryClient.invalidateQueries({ queryKey: ['ReportGradeByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['ReportGradeByTeacherId', data.teacherId] });
        if (data.teacherScheduleId) {
          queryClient.invalidateQueries({ queryKey: ['EnrollmentByTeacherScheduleId', { id: data.teacherScheduleId, category: data.category }] });
        }
      }
    },
  });
};
