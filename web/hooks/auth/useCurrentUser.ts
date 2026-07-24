import { getCurrentUser } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = (enabled: boolean) => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};