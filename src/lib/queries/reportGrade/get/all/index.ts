import { getReportGradeByCategoryAction } from '@/action/reportGrade/get/all';
import { useQuery } from '@tanstack/react-query';

export const useReportGradeQueryByCategory = (category: string) => {
  return useQuery<any, Error>({
    queryKey: ['ReportGrade', category],
    queryFn: () => getReportGradeByCategoryAction(category),
    enabled: !!category,
    retry: 0,
    refetchOnWindowFocus: false,
  });
};
