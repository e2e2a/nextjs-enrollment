import { getEnrollmentSetupAction } from "@/action/enrollmentSetup/get";
import { useQuery } from "@tanstack/react-query";

export const useEnrollmentSetupQuery = () => {
    return useQuery<any, Error>({
      queryKey: ['EnrollmentSetup'],
      queryFn: () => getEnrollmentSetupAction(),
      retry: 0,
      refetchOnWindowFocus: false,
    });
  };