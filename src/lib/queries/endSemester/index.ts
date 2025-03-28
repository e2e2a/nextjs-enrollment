import { EndSemesterAction } from '@/action/endSemester';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCollegeEndSemesterMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => EndSemesterAction(data),
    onSuccess: async (data) => {
      // invalidate Enrollments
      queryClient.invalidateQueries({ queryKey: ['EnrollmentSetup'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByCategory', data.category] });
      if (data.courses && data.courses.length > 0) {
        data.courses.forEach(async (e: any) => {
          queryClient.invalidateQueries({ queryKey: ['AllEnrollmentByCourseId', e._id] });
          await supabase.channel('global-channel').send({
            type: 'broadcast',
            event: 'invalidate-query',
            payload: {
              queryKeys: [{ key1: 'BlockTypeByCourseId', key2: e._id }],
            },
          });
        });
      }
      queryClient.invalidateQueries({ queryKey: ['EnrollmentById'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByProfileId'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentBySessionId'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByTeacherScheduleId'] });
      for (let i = 1; i <= 6; i++) {
        queryClient.invalidateQueries({ queryKey: ['EnrollmentStepByCategory', `${data.category}-${i}`] }); // @todo broadcast
        await supabase.channel('global-channel').send({
          type: 'broadcast',
          event: 'invalidate-query',
          payload: {
            queryKeys: [{ key1: 'EnrollmentStepByCategory', key2: `${data.category}-${i}` }],
          },
        });
      }

      // invalidate teacher schedule and blocks
      if (data.deleteInstructor) {
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleRecordById'] });
        queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByProfileId'] });
        queryClient.invalidateQueries({ queryKey: ['BlockTypeByCategory', data.category] });
        if (data.courses && data.courses.length > 0) {
          data.courses.forEach(async (e: any) => {
            queryClient.invalidateQueries({ queryKey: ['BlockTypeByCourseId', e._id] });
            await supabase.channel('global-channel').send({
              type: 'broadcast',
              event: 'invalidate-query',
              payload: {
                queryKeys: [{ key1: 'BlockTypeByCourseId', key2: e._id }],
              },
            });
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

      await supabase.channel('global-channel').send({
        type: 'broadcast',
        event: 'invalidate-query',
        payload: {
          queryKeys: [
            { key1: 'EnrollmentSetup', key2: '' },
            { key1: 'EnrollmentByCategory', key2: data.category },
            { key1: 'EnrollmentById', key2: '' },
            { key1: 'EnrollmentByProfileId', key2: '' },
            { key1: 'EnrollmentByTeacherScheduleId', key2: '' },
            { key1: 'TeacherScheduleByCategory', key2: data.category },
            { key1: 'TeacherScheduleRecordById', key2: '' },
            { key1: 'TeacherScheduleByProfileId', key2: '' },
            { key1: 'BlockTypeByCategory', key2: data.category },
            { key1: 'BlockTypeById', key2: '' },
            { key1: 'ReportGradeByCategory', key2: data.category },
            { key1: 'ReportGradeById', key2: '' },
            { key1: 'ReportGradeByTeacherId', key2: '' },
            { key1: 'ProfileBySessionId', key2: '' },
            { key1: 'ProfileByParamsUserId', key2: '' },
            { key1: 'AllProfilesByRoles', key2: 'STUDENT' },
          ],
        },
      });
    },
  });
};
