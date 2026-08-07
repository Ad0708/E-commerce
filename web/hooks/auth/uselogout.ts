// import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/store/auth.store";
// import { logoutapi } from "@/api/auth";
// import { useMutation } from "@tanstack/react-query";
// import { useWishlistStore } from "@/store/wishlist.store";

// export const useLogout = () => {
//   const router = useRouter();

//   return useMutation({
//     mutationFn: logoutapi,
//     onSuccess: () => {
//       useAuthStore.getState().setUser(null);
//       useWishlistStore.getState().clearWishlist();
//       localStorage.removeItem("loggedIn");
//       document.cookie =
//         "auth_token=; Max-Age=0; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
//       router.replace("/login");
//       // useAuthStore.getState().logout();
//     },
//     onError: (error) => {
//       console.error("Logout failed:", error);
//     },
//   });
// };

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { logoutapi } from "@/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import { useNotificationStore } from "@/store/notification.store";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Remove frontend cookie first
      document.cookie =
        "auth_token=; Max-Age=0; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Then call backend logout
      return await logoutapi();
    },

    onSuccess: () => {
      useAuthStore.getState().setUser(null);
      useWishlistStore.getState().clearWishlist();
      useCartStore.getState().clearCart();
      useNotificationStore.getState().clearNotifications();
      queryClient.clear();
      localStorage.removeItem("loggedIn");

      window.location.href = "/login";
    },

    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
};
