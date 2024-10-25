import { signOutAction } from '@/action/auth/signOut';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Custom hook to handle the sign-in mutation for users with any role.
 * 
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */
export const useSignOutMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, any>({
      mutationFn: async (data) => signOutAction(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['AllUsers'] });
      },
    });
  };
