import { createTuitionFeeAction } from '@/action/courseFee/create';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreatTuitionFeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createTuitionFeeAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['TuitionFeeByCategory', data.category] });
      }
    },
  });
};
