import { emailRecoveryAction } from "@/action/tokens/verification/recovery";
import { recoveryResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";

/**
 * Custom hook to handle recovery email for any role.
 *
 * @returns {UseMutationResult} Mutation object with status, error, and mutate methods.
 */
export const useRecoveryMutation = () => {
    return useMutation<recoveryResponse, Error, any>({
      mutationFn: async (data) => emailRecoveryAction(data),
    });
  };