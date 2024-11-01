import { getTeacherScheduleByIdAction } from '@/action/teacherSchedule/get/id';
import { useQuery } from '@tanstack/react-query';

export const useTeacherScheduleQueryById = (id: string, category: string) => {
  return useQuery<any, Error>({
    queryKey: ['TeacherScheduleById', id],
    queryFn: () => getTeacherScheduleByIdAction({id, category}),
    retry: 0,
    enabled: !!id,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
