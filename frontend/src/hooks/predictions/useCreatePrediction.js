import { createPrediction } from "@/api/prediction.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreatePrediction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPrediction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["predictions"],
      });
    },
  });
};
