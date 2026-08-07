"use client";
import { AxiosError } from "axios";

import { useMutation } from "@tanstack/react-query";
import { signupApi } from "@/api/auth";
import toast from "react-hot-toast";

type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

type SignupResponse = {
  success: boolean;
  message: string;
};

export const useSignup = () => {
  return useMutation<SignupResponse, unknown, SignupPayload>({
    mutationFn: signupApi,

    onSuccess: (data) => {
      toast.success(
        data.message ||
          "Account created successfully. Please login to continue.",
      );
    },

    onError: (error) => {
      toast.error((error as AxiosError<{message?: string}>)?.response?.data?.message || "Signup failed");
    },
  });
};
