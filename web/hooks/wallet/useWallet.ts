import { useQuery } from "@tanstack/react-query";
import { getWallet } from "@/api/wallet";

export const useWallet = () => {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: getWallet,
  });
};