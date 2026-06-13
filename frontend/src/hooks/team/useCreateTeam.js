import { createTeam } from "@/api/team.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams"],
      });
    },
  });
};
