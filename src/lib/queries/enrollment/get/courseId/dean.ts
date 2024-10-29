import { getAllStudentByCourseIdAction } from '@/action/enrollment/get/courseId/dean';
import { useQuery } from '@tanstack/react-query';

/**
 * only DEAN roles
 * Custom hook query profile by session id.
 *
 * @param {string}
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */

/**
 * Custom hook query profile by session id.
 *
 * @todo big problem 
 * 1. change the variable name
 */
export const useAllEnrollmentQueryByCourseId = (courseId: string) => {
  return useQuery<any, Error>({
    queryKey: ['AllEnrollmentByCourseId', courseId],
    queryFn: () => getAllStudentByCourseIdAction(courseId),
    enabled: !!courseId,
    retry: 0,
    refetchOnWindowFocus: false,
  });
};
