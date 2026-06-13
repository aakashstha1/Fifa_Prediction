import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export const useGetAllPredictions = (userId, matchId) => {
  return useInfiniteQuery({
    queryKey: ["predictions", userId, matchId],

    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get("/predictions", {
        params: {
          page: pageParam,
          limit: 10,
          userId,
          matchId,
        },
      });

      return data;
    },

    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
  });
};
