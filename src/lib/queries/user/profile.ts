import { newUsernameAction } from '@/action/profile/NewUsername';
import { UsernameValidator } from '@/lib/validators/Validator';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

export const useAdminNewUsernameMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => newUsernameAction(data),
    onSuccess: (data) => {
      //pass role in response so we can know which role we need to invalidate
      queryClient.invalidateQueries({ queryKey: ['userAdminProfile'] });
    },
  });
};
