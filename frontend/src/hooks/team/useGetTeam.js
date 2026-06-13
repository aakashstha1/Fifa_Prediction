import { getTeams } from "@/api/team.api";
import { useQuery } from "@tanstack/react-query";

export const useGetTeam = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });
};
