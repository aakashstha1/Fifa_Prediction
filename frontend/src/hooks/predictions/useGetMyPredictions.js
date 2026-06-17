import { getMyPredictions } from "@/api/prediction.api";
import { useQuery } from "@tanstack/react-query";

export const useGetMyPredictions = (page) => {
  return useQuery({
    queryKey: ["predictions", page],
    queryFn: () => getMyPredictions(page),
    keepPreviousData: true,
  });
};
