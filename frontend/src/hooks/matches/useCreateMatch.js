import { createMatch } from "@/api/match.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["matches"],
      });
    },
  });
};
