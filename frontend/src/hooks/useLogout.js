import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "@/api/users.api";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,

    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null);

      navigate("/login", { replace: true });
    },
  });
};
