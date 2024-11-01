import { getTeacherScheduleByCategoryAction } from '@/action/teacherSchedule/get/category';
import { useQuery } from '@tanstack/react-query';

export const useTeacherScheduleQueryByCategory = (category: string) => {
  return useQuery<any, Error>({
    queryKey: ['TeacherScheduleByCategory', category],
    queryFn: () => getTeacherScheduleByCategoryAction(category),
    enabled: !!category,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
