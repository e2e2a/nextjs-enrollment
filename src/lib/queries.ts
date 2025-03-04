import { useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import { deleteEnrollmentAction } from '@/action/college/enrollment/user';
const channel = new BroadcastChannel('my-channel');
// import { supabase } from './supabaseClient';

/**
 * Students Enrollment
 * @returns Queries and mutations
 */
export const useEnrollmentDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => deleteEnrollmentAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Enrollment'] });
    },
  });
};
