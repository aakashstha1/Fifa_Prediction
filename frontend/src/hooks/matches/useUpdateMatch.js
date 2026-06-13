import { updateMatch } from "@/api/match.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["matches"],
      });
    },
  });
};
