import { newPasswordAction } from '@/action/user/password';
import { NewPasswordValidator } from '@/lib/validators/user/password';
import { useMutation } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import { z } from 'zod';

/**
 * @authenticated
 * any role
 * Custom hook to handle update of user's password for any role.
 *
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */
export const useNewPasswordMutation = () => {
  return useMutation<any, Error, z.infer<typeof NewPasswordValidator>>({
    mutationFn: async (data) => newPasswordAction(data),
  });
};
