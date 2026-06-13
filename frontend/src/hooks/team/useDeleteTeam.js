import { deleteTeam } from "@/api/team.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams"],
      });
    },
  });
};
