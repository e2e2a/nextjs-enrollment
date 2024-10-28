import { getSubjectByCategoryAction } from '@/action/subjects/get/category';
import { useQuery } from '@tanstack/react-query';

export const useSubjectQueryByCategory = (category: string) => {
  return useQuery<any, Error>({
    queryKey: ['SubjectByCategory', category],
    queryFn: () => getSubjectByCategoryAction(category),
    enabled: !!category,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
