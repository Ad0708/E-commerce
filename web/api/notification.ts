// src/api/notification.api.ts

import api from "@/lib/axios/axios";

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "order" | "profile" | "offer" | "wishlist" | "system";
  link: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  pagination: NotificationPagination;
}

export const getNotifications = async ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}): Promise<NotificationsResponse> => {
  
  const { data } = await api.get<NotificationsResponse>(
    `/notifications?page=${page}&limit=${limit}`
  );

  return data;
};

export const markNotificationRead = async (
  notificationId: string
): Promise<{ message: string }> => {
  const { data } = await api.patch<{ message: string }>(
    `/notifications/${notificationId}/read`
  );

  return data;
};

export const markAllNotificationsRead = async (): Promise<{
  message: string;
}> => {
  const { data } = await api.patch<{ message: string }>(
    "/notifications/read-all"
  );

  return data;
};

export const deleteNotification = async (
  notificationId: string
): Promise<{ message: string }> => {
  const { data } = await api.delete<{ message: string }>(
    `/notifications/${notificationId}`
  );

  return data;
};