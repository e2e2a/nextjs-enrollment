import { getBlockTypeByIdAction } from '@/action/blocks/get/id';
import { useQuery } from '@tanstack/react-query';

export const useBlockCourseQueryById = (id: any) => {
  return useQuery<any, Error>({
    queryKey: ['BlockTypeById', id],
    queryFn: () => getBlockTypeByIdAction(id),
    enabled: !!id,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
