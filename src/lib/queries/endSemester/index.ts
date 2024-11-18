import { EndSemesterAction } from '@/action/endSemester';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCollegeEndSemesterMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => EndSemesterAction(data),
    onSuccess: (data) => {
      // invalidate Enrollments
      queryClient.invalidateQueries({ queryKey: ['EnrollmentSetup'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByCategory', data.category] });
      if (data.courses && data.courses.length > 0) {
        data.courses.forEach((e: any) => {
          queryClient.invalidateQueries({ queryKey: ['AllEnrollmentByCourseId', e._id] });
        });
      }
      queryClient.invalidateQueries({ queryKey: ['EnrollmentById'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByProfileId'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentBySessionId'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByTeacherScheduleId'] });
      for (let i = 1; i <= 6; i++) {
        queryClient.invalidateQueries({ queryKey: ['EnrollmentStepByCategory', `${data.category}-${i}`] }); // @todo broadcast
      }

      // invalidate teacher schedule and blocks
      if (data.deleteInstructor) {
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleRecordById'] });
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByProfileId'] });
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCategory', data.category] });
        if (data.courses && data.courses.length > 0) {
          data.courses.forEach((e: any) => {
            queryClient.invalidateQueries({ queryKey: ['BlockTypeByCourseId', e._id] });
          });
        }
        queryClient.invalidateQueries({ queryKey: ['BlockTypeById'] });
      }

      // invalidate report grades
      queryClient.invalidateQueries({ queryKey: ['ReportGradeByCategory', data.category] });
      queryClient.invalidateQueries({ queryKey: ['ReportGradeById'] });
      queryClient.invalidateQueries({ queryKey: ['ReportGradeByTeacherId'] });

      // invalidate profiles
      queryClient.invalidateQueries({ queryKey: ['ProfileBySessionId'] });
      queryClient.invalidateQueries({ queryKey: ['ProfileByParamsUserId'] });
      queryClient.invalidateQueries({ queryKey: ['AllProfilesByRoles', 'STUDENT'] });
    },
  });
};
