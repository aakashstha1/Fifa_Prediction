import { deleteMatch } from "@/api/match.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["matches"],
      });
    },
  });
};
