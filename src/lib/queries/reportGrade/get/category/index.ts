import { getReportGradeByCategoryAction } from '@/action/reportGrade/get/category';
import { useQuery } from '@tanstack/react-query';

export const useReportGradeQueryByCategory = (category: string, requestType: string) => {
  return useQuery<any, Error>({
    queryKey: ['ReportGradeByCategory', `${category}-${requestType}`],
    queryFn: () => getReportGradeByCategoryAction(category, requestType),
    enabled: !!category && !!requestType,
    retry: 0,
    refetchOnWindowFocus: false,
  });
};
