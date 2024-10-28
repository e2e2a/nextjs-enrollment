import { getAllCoursesByCategory } from "@/action/courses/get/category";
import { useQuery } from "@tanstack/react-query";

export const useCourseQueryByCategory = (category: any) => {
    return useQuery<any, Error>({
      queryKey: ['CourseByCategory', category],
      queryFn: () => getAllCoursesByCategory(category),
      retry: 0,
      enabled: !!category,
      refetchOnMount: false,
      refetchOnWindowFocus: true,
    });
  };