import { getEnrollmentRecordByProfileIdAction } from '@/action/enrollmentRecord/get/profileId';
import { useQuery } from '@tanstack/react-query';

export const useEnrollmentRecordQueryByProfileId = (profileId: string) => {
  return useQuery<any, Error>({
    queryKey: ['EnrollmentRecordByProfileId', profileId],
    queryFn: () => getEnrollmentRecordByProfileIdAction(),
    enabled: !!profileId,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
