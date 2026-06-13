import { getAllPredictions } from "@/api/prediction.api";

// export const useGetAllPredictions = () => {
//   return useQuery({
//     queryKey: ["predictions"],
//     queryFn: getAllPredictions,
//   });
// };

import { useInfiniteQuery } from "@tanstack/react-query";

export const useGetAllPredictions = (userId, matchId) => {
  return useInfiniteQuery({
    queryKey: ["predictions", userId, matchId],

    queryFn: ({ pageParam = 1 }) =>
      getAllPredictions(pageParam, userId, matchId),

    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
  });
};
