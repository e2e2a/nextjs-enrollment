import { getAllEnrollmentByCourseIdAction } from '@/action/enrollment/get/courseId/dean';
import { useQuery } from '@tanstack/react-query';

/**
 * only DEAN roles
 * Custom hook query profile by session id.
 *
 * @param {string} courseId
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */
export const useAllEnrollmentQueryByCourseId = (courseId: string) => {
  return useQuery<any, Error>({
    queryKey: ['AllEnrollmentByCourseId', courseId],
    queryFn: () => getAllEnrollmentByCourseIdAction(courseId),
    enabled: !!courseId,
    retry: 0,
    refetchOnWindowFocus: false,
  });
};
