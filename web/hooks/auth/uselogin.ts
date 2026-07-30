import { loginApi } from "@/api/auth";
import { addToCart } from "@/api/cart";
import { addToWishlist } from "@/api/wishlist";
import { useAuthStore } from "@/store/auth.store";
import { useAuthModalStore } from "@/store/authModal.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

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
  const queryClient = useQueryClient();

  return useMutation<
    LoginResponse,
    any,
    {
      email: string;
      password: string;
    }
  >({
    mutationFn: loginApi,

    onSuccess: async (data) => {
      try {
        document.cookie = `auth_token=${data.token}; path=/`;
        useAuthStore.getState().setUser(data.user);
        toast.success(data.message || "Logged in successfully");

        // Check for pending actions
        let pending = useAuthModalStore.getState().pendingAction;
        if (!pending && typeof window !== "undefined") {
          try {
            const stored = sessionStorage.getItem("pending_user_action");
            if (stored) {
              pending = JSON.parse(stored);
            }
          } catch (e) {
            console.error("Error reading pending action:", e);
          }
        }

        if (pending) {
          useAuthModalStore.getState().clearPendingAction();

          if (pending.type === "ADD_TO_CART") {
            try {
              await addToCart(pending.payload);
              queryClient.invalidateQueries({ queryKey: ["cart"] });
              toast.success("Pending item added to cart!");
            } catch (err: any) {
              console.error("Failed to add pending item to cart:", err);
            }
          } else if (pending.type === "ADD_TO_WISHLIST") {
            try {
              await addToWishlist(pending.productId);
              queryClient.invalidateQueries({ queryKey: ["wishlist"] });
              toast.success("Item added to wishlist!");
            } catch (err: any) {
              console.error("Failed to add pending item to wishlist:", err);
            }
          }
        }
      } catch (error) {
        console.error("Failed to store frontend cookie:", error);
        toast.error("Failed to store login session");
      }
    },

    onError: (error) => {
      console.log(error);
      toast.error(error?.response?.data?.message || "Login failed");
    },
  });
};
