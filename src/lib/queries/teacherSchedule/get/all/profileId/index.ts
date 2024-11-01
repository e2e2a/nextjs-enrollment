import { getTeacherScheduleByProfileIdAction } from '@/action/teacherSchedule/get/all/profileId';
import { useQuery } from '@tanstack/react-query';

export const useTeacherScheduleQueryByProfileId = (data: any) => {
  return useQuery<any, Error>({
    queryKey: ['TeacherScheduleByProfileId', data],
    queryFn: () => getTeacherScheduleByProfileIdAction(data),
    retry: 0,
    enabled: !!data,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
