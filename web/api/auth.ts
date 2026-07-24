import { User } from "@/types/user";
import api from "../lib/axios/axios";

export const signupApi = async (data: any) => {
  const response = await api.post("/auth/signup", data);
    console.log("signupApi response:", response.data);
  return response.data;
};

export const loginApi = async (data: any) => {
  const response = await api.post("/auth/login", data);
  console.log("loginApi response:", response.data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data.user as User;
};

export const logoutapi = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};