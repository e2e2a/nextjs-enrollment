import { getAllUsersAction } from "@/action/user/get/all";
import { useQuery } from "@tanstack/react-query";

export const useAllUsersQuery = () => {
  return useQuery<any, Error>({
    queryKey: ['AllUsers'],
    queryFn: () => getAllUsersAction(),
    retry: 0,
    refetchOnWindowFocus: false,
  });
};