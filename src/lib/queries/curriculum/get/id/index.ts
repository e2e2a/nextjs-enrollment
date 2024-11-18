import { getCurriculumByIdAction } from '@/action/curriculum/get/id';
import { useQuery } from '@tanstack/react-query';

export const useCurriculumQueryById = (id: string) => {
  return useQuery<any, Error>({
    queryKey: ['CurriculumById', id],
    queryFn: () => getCurriculumByIdAction(id),
    retry: 0,
    enabled: !!id,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
