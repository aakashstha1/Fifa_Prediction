import { toggleTeam } from "@/api/team.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateTeamStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams"],
      });
    },
  });
};
