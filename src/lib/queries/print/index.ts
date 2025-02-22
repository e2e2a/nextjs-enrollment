import { printReportAction } from '@/action/print';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const usePrintReportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => printReportAction(data),
    onSuccess: (data) => {},
  });
};
