import { getTeacherScheduleRecordByIdAction } from '@/action/teacherScheduleRecord/get/id';
import { useQuery } from '@tanstack/react-query';

export const useTeacherScheduleRecordQueryById = (id: string) => {
  return useQuery<any, Error>({
    queryKey: ['TeacherScheduleRecordById', id],
    queryFn: () => getTeacherScheduleRecordByIdAction(id),
    enabled: !!id,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
