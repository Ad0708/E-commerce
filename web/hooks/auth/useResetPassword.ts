import { useMutation } from "@tanstack/react-query";
import { resetPasswordApi } from "@/api/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { token: string; password: string }) => resetPasswordApi(data),
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successful.");
      router.push("/login");
    },
    onError: (error: unknown) => {
      const errorMessage = (error as AxiosError<{ message?: string }>)?.response?.data?.message;
      toast.error(
        errorMessage || "Failed to reset password. Please try again."
      );
      if (errorMessage?.toLowerCase().includes("expired") || errorMessage?.toLowerCase().includes("invalid")) {
        router.push("/login");
      }
    },
  });
};
