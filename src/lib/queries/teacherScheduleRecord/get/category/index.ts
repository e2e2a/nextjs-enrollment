import { getTeacherScheduleRecordByCategoryAction } from '@/action/teacherScheduleRecord/get/category';
import { useQuery } from '@tanstack/react-query';

export const useTeacherScheduleRecordQueryByCategory = (category: string) => {
  return useQuery<any, Error>({
    queryKey: ['TeacherScheduleRecordByCategory', category],
    queryFn: () => getTeacherScheduleRecordByCategoryAction(category),
    enabled: !!category,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
