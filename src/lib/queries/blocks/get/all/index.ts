import { getBlockTypeByCategoryAction } from '@/action/blocks/get/all';
import { useQuery } from '@tanstack/react-query';

export const useBlockCourseQueryByCategory = (category: string) => {
  return useQuery<any, Error>({
    queryKey: ['BlockType', category],
    queryFn: () => getBlockTypeByCategoryAction(category),
    enabled: !!category,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
