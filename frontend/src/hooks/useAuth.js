import { fetchMe } from "@/api/users.api";
import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: fetchMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    user,
    isLoading,
    isError,
    isAuthenticated: !!user,
  };
};
