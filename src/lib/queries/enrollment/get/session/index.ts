import { getEnrollmentBySessionIdAction } from '@/action/enrollment/get/session';
import { useQuery } from '@tanstack/react-query';

export const useEnrollmentQueryBySessionId = (id: string) => {
  return useQuery<any, Error>({
    queryKey: ['EnrollmentBySessionId', id],
    queryFn: () => getEnrollmentBySessionIdAction(id),
    enabled: !!id,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
