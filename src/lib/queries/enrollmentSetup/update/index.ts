import { updateEnrollmentSetupAction } from "@/action/enrollmentSetup/update";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateEnrollmentSetupMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, any>({
      mutationFn: async (data) => updateEnrollmentSetupAction(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['EnrollmentSetup'] }); // @todo broadcast
      },
    });
  };