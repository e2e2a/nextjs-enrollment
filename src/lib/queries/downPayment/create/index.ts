import { createDownPaymentAction } from '@/action/downPayment/create';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateDownPaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createDownPaymentAction(data),
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries({ queryKey: ['DownPaymentByCategory', data.category] });
      }
    },
  });
};
