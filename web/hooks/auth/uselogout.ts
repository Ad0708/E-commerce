import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { logoutapi } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useWishlistStore } from "@/store/wishlist.store";

export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: logoutapi,
    onSuccess: () => {
      useAuthStore.getState().setUser(null);
      useWishlistStore.getState().clearWishlist();
      localStorage.removeItem("loggedIn");
      document.cookie =
        "token=; Max-Age=0; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.replace("/login");
      // useAuthStore.getState().logout();
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
};
