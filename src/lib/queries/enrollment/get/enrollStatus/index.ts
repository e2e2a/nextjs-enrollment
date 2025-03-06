import { getEnrollmentByEnrollStatusAction } from '@/action/enrollment/get/enrollStatus';
import { useQuery } from '@tanstack/react-query';

export const useEnrollmentQueryByEnrollStatus = (enrollStatus: string) => {
  return useQuery<any, Error>({
    queryKey: ['EnrollmentByEnrollStatus', enrollStatus],
    queryFn: () => getEnrollmentByEnrollStatusAction(enrollStatus),
    enabled: !!enrollStatus,
    retry: 0,
    refetchOnWindowFocus: false,
  });
};
