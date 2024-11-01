import { getEnrollmentByTeacherScheduleIdAction } from '@/action/enrollment/get/TeacherScheduleId';
import { useQuery } from '@tanstack/react-query';

export const useEnrollmentQueryByTeacherScheduleId = (data: any) => {
  return useQuery<any, Error>({
    queryKey: ['EnrollmentByTeacherScheduleId', data],
    queryFn: () => getEnrollmentByTeacherScheduleIdAction(data),
    enabled: !!data,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
