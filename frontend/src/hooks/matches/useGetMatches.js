import { getMatches } from "@/api/match.api";
import { useQuery } from "@tanstack/react-query";

export const useGetMatches = () => {
  return useQuery({
    queryKey: ["matches"],
    queryFn: getMatches,
  });
};
