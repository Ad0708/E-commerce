import api from "@/lib/axios/axios";

export const getWallet = async () => {
  const { data } = await api.get("/wallet");

  return data;
};