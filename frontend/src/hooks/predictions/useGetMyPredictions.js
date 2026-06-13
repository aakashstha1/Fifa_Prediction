import { getMyPredictions } from "@/api/prediction.api";
import { useQuery } from "@tanstack/react-query";

export const useGetMyPredictions = () => {
  return useQuery({
    queryKey: ["predictions"],
    queryFn: getMyPredictions,
  });
};
