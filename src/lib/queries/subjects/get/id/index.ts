import { getSubjectByIdAction } from '@/action/subjects/get/id';
import { useQuery } from '@tanstack/react-query';

export const useSubjectQueryById = (id: string) => {
  return useQuery<any, Error>({
    queryKey: ['SubjectById', id],
    queryFn: () => getSubjectByIdAction(id),
    enabled: !!id,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
