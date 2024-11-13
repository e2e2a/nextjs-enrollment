import { getReportGradeByCategoryAction } from '@/action/reportGrade/get/category';
import { useQuery } from '@tanstack/react-query';

export const useReportGradeQueryByCategory = (category: string) => {
  return useQuery<any, Error>({
    queryKey: ['ReportGradeByCategory', category],
    queryFn: () => getReportGradeByCategoryAction(category),
    enabled: !!category,
    retry: 0,
    refetchOnWindowFocus: false,
  });
};
