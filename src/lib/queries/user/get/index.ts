import { getAllUsersAction } from "@/action/user";
import { useQuery } from "@tanstack/react-query";

export const useAllUsersQuery = () => {
  return useQuery<any, Error>({
    queryKey: ['AllUsers'],
    queryFn: () => getAllUsersAction(),
    retry: 0,
    refetchOnWindowFocus: false,
  });
};