import { newPasswordActionByAdmin } from '@/action/user/update/id/password';
import { NewPasswordValidator } from '@/lib/validators/user/update/password';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

/**
 * @authenticated
 * only admin role
 * Custom hook to handle update of user's password for any role.
 *
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */
export const useNewPasswordMutationByAdmin = () => {
  return useMutation<any, Error, z.infer<typeof NewPasswordValidator>>({
    mutationFn: async (data) => newPasswordActionByAdmin(data),
  });
};
