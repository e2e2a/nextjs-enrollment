import { getReportGradeByIdAction } from "@/action/reportGrade/get/id";
import { useQuery } from "@tanstack/react-query";

export const useReportGradeQueryById = (id: any) => {
    return useQuery<any, Error>({
      queryKey: ['ReportGradeById', id],
      queryFn: () => getReportGradeByIdAction(id),
      enabled: !!id,
      retry: 0,
      refetchOnWindowFocus: false,
    });
  };