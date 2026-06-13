import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "@/api/users.api";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,

    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.setQueryData(["authUser"], null);
      queryClient.clear();

      navigate("/login", { replace: true });
    },
  });
};
