import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerUser } from "@/api/users.api";

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerUser,

    onSuccess: (user) => {
      queryClient.setQueryData(["authUser"], user);
    },
  });
};
