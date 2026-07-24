import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/api/notification";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useInfiniteNotifications = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam = 1 }) =>
      getNotifications({
        page: pageParam,
        limit,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      toast.success("Notification marked as read.");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update notification.",
      );
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      toast.success(data.message);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update notifications.",
      );
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      toast.success(data.message);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete notification.",
      );
    },
  });
};
