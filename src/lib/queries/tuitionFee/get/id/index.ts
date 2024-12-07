import { getTuitionFeeByIdAction } from '@/action/tuitionFee/get/id';
import { useQuery } from '@tanstack/react-query';

export const useTuitionFeeQueryById = (id: string) => {
  return useQuery<any, Error>({
    queryKey: ['TuitionFeeById', id],
    queryFn: () => getTuitionFeeByIdAction(id),
    retry: 0,
    enabled: !!id,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
