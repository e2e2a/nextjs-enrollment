import { getTeacherScheduleRecordByProfileIdAction } from "@/action/teacherScheduleRecord/get/profileId";
import { useQuery } from "@tanstack/react-query";

export const useTeacherScheduleRecordQueryByProfileId = (profileId: string) => {
    return useQuery<any, Error>({
      queryKey: ['TeacherScheduleRecordByProfileId', profileId],
      queryFn: () => getTeacherScheduleRecordByProfileIdAction(),
      enabled: !!profileId,
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: true,
    });
  };