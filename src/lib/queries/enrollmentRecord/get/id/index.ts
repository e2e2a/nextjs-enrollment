import { getEnrollmentRecordByIdAction } from '@/action/enrollmentRecord/get/id';
import { useQuery } from '@tanstack/react-query';

export const useEnrollmentRecordQueryById = (id: string) => {
  return useQuery<any, Error>({
    queryKey: ['EnrollmentRecordById', id],
    queryFn: () => getEnrollmentRecordByIdAction(id),
    enabled: !!id,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
