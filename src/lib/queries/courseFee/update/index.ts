import { updateTuitionFeeAction } from '@/action/courseFee/update';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateTuitionFeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateTuitionFeeAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['TuitionFeeByCategory', data.category] });
        queryClient.invalidateQueries({ queryKey: ['TuitionFeeById', data.id] });
      }
    },
  });
};
