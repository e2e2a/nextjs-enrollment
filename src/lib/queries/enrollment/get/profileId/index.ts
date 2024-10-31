import { getEnrollmentByProfileIdAction } from '@/action/enrollment/get/profileId';
import { useQuery } from '@tanstack/react-query';

// this has nothing to do with updates to broadcast
export const useEnrollmentQueryByProfileId = (id: string, hasEnabled: boolean) => {
  return useQuery<any, Error>({
    queryKey: ['EnrollmentByProfileId', id],
    queryFn: () => getEnrollmentByProfileIdAction(id),
    retry: 0,
    enabled: !!hasEnabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
