import { getEnrollmentQueryStepByCategoryAction } from "@/action/enrollment/get/step";
import { useQuery } from "@tanstack/react-query";

export const useEnrollmentQueryStepByCategory = (data: any) => {
    return useQuery<any, Error>({
      queryKey: ['EnrollmentStepByCategory', data],
      queryFn: () => getEnrollmentQueryStepByCategoryAction(data),
      retry: 0,
      enabled: !!data,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    });
  };