import { getScholarshipByIdAction } from '@/action/scholarship/get/id';
import { useQuery } from '@tanstack/react-query';

export const useScholarshipQueryById = (id: string) => {
  return useQuery<any, Error>({
    queryKey: ['ScholarshipById', id],
    queryFn: () => getScholarshipByIdAction(id),
    enabled: !!id,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
