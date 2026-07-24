"use client";

import { useMutation } from "@tanstack/react-query";
import { loginApi } from "@/api/auth";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";

type LoginResponse = {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "customer" | "admin";
  };
};

export const useLogin = () => {
  return useMutation<
    LoginResponse,
    any,
    {
      email: string;
      password: string;
    }
  >({
    mutationFn: loginApi,

    onSuccess: (data) => {
      toast.success(
        data.message || "Logged in successfully"
      );
    },


    onError: (error) => {
      console.log("error", error);
      toast.error(
        error?.response?.data?.message ||
          "Login failed"
      );
    },
  });
};