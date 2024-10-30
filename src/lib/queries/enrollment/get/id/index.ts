import { getEnrollmentByIdAction } from '@/action/enrollment/get/id';
import { useQuery } from '@tanstack/react-query';

export const useEnrollmentQueryById = (id: string) => {
  return useQuery<any, Error>({
    queryKey: ['EnrollmentById', id],
    queryFn: () => getEnrollmentByIdAction(id),
    retry: 0,
    enabled: !!id,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
