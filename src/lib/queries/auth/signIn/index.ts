import { signInAction } from "@/action/auth/signIn";
import { SigninValidator } from "@/lib/validators/Validator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const useSignInMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, z.infer<typeof SigninValidator>>({
      mutationFn: async (data) => signInAction(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['AllUsers'] });
      },
    });
  };