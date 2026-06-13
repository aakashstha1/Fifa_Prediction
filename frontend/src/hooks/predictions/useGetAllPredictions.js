import { getAllPredictions } from "@/api/prediction.api";
import { useQuery } from "@tanstack/react-query";

export const useGetAllPredictions = (userId, matchId, page) => {
  return useQuery({
    queryKey: ["predictions", userId, matchId, page],

    queryFn: () => getAllPredictions(page, userId, matchId),
  });
};
