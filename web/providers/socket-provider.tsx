"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/lib/socket/socket";
import { useAuthStore } from "@/store/auth.store";
import { usePathname, useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/notification.store";
import { getNotifications } from "@/api/notification";
import { useStoreBasic } from "@/hooks/store/useStore";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const addNotification = useNotificationStore.getState().addNotification;

  const pathname = usePathname();

  const publicRoutes = ["/login", "/signup", "/forgot-password"];

  const isAdminRoute = pathname.startsWith("/admin");

  const isPublicRoute = publicRoutes.includes(pathname);

  const user = useAuthStore((state) => state.user);
  const { data: store } = useStoreBasic();
  // console.log(store?.logo);

  useEffect(() => {
    if (!user) {
      socket.disconnect();
      return;
    }

    const requestNotificationPermission = async () => {
      if ("Notification" in window) {
        if (Notification.permission === "default") {
          const permission = await Notification.requestPermission();

          console.log("Notification permission:", permission);
        }
      }
    };

    requestNotificationPermission();

    const loadNotifications = async () => {
      if (isPublicRoute || isAdminRoute) return;
      try {
        const data = await queryClient.fetchInfiniteQuery({
          queryKey: ["notifications"],
          queryFn: ({ pageParam = 1 }) =>
            getNotifications({
              page: pageParam,
              limit: 10,
            }),
          initialPageParam: 1,
        });

        const notifications =
          data.pages.flatMap((page: any) => page.notifications) ?? [];

        useNotificationStore.getState().setNotifications(notifications);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    };

    loadNotifications();

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join", user.id);

    socket.on("notification", (notification) => {
      // Update Zustand store (bell count)
      console.log("Notification received:", notification);
      //   console.log("Notification permission:", Notification.permission);
      addNotification(notification);

      // Update React Query cache (popup list)
      queryClient.setQueryData(["notifications"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              notifications: [notification, ...old.pages[0].notifications],
            },
            ...old.pages.slice(1),
          ],
        };
      });

      // Browser notification
      if ("Notification" in window && Notification.permission === "granted") {
        const browserNotification = new Notification(notification.title, {
          body: `${notification.message}\nOrder ID: ${
            notification.metadata?.orderId || ""
          }`,
          icon: store?.logo,
          data: {
            link: notification.link,
            orderId: notification.metadata?.orderId,
          },
        });

        browserNotification.onclick = () => {
          window.focus();

          if (browserNotification.data?.link) {
            router.push(browserNotification.data.link);
          }
        };
      }
    });

    return () => {
      socket.off("notification");
      socket.disconnect();
    };
  }, [user, queryClient]);

  return <>{children}</>;
}
