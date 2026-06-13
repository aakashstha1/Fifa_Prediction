import { api } from "@/configs/axios-config";
import { useQuery } from "@tanstack/react-query";

export const useGetAllPredictions = (userId, matchId, page) => {
  return useQuery({
    queryKey: ["predictions", userId, matchId, page],

    queryFn: async () => {
      const { data } = await api.get("/predictions", {
        params: {
          page,
          limit: 10,
          userId: userId || undefined,
          matchId: matchId || undefined,
        },
      });

      return data;
    },

    keepPreviousData: true,
  });
};
