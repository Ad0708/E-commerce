import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordApi } from "@/api/auth";
import toast from "react-hot-toast";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => forgotPasswordApi(email),
    onSuccess: (data) => {
      toast.success(data.message || "Email sent successfully.");
    },
    onError: (error: unknown) => {
      toast.error(
        (error as AxiosError<{message?: string}>)?.response?.data?.message || "Failed to send reset link. Please try again.",
      );
    },
  });
};
