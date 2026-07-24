// import { create } from "zustand";

// export interface Notification {
//   _id: string;
//   title: string;
//   message: string;
//   type: string;
//   isRead: boolean;
//   referenceId?: string;
//   createdAt: string;
// }

// interface NotificationState {
//   notifications: Notification[];
//   unreadCount: number;

//   setNotifications: (notifications: Notification[]) => void;
//   addNotification: (notification: Notification) => void;
//   markAsRead: (id: string) => void;
//   markAllAsRead: () => void;
//   setUnreadCount: (count: number) => void;
// }

// export const useNotificationStore = create<NotificationState>((set) => ({
//   notifications: [],
//   unreadCount: 0,

//   setNotifications: (notifications) =>
//     set({
//       notifications,
//       unreadCount: notifications.filter((n) => !n.isRead).length,
//     }),

//   addNotification: (notification) =>
//     set((state) => ({
//       notifications: [notification, ...state.notifications],
//       unreadCount:
//         state.unreadCount + (notification.isRead ? 0 : 1),
//     })),

//   markAsRead: (id) =>
//     set((state) => {
//       const notifications = state.notifications.map((item) =>
//         item._id === id ? { ...item, isRead: true } : item
//       );

//       return {
//         notifications,
//         unreadCount: notifications.filter((n) => !n.isRead).length,
//       };
//     }),

//   markAllAsRead: () =>
//     set((state) => {
//       const notifications = state.notifications.map((item) => ({
//         ...item,
//         isRead: true,
//       }));

//       return {
//         notifications,
//         unreadCount: 0,
//       };
//     }),

//   setUnreadCount: (count) =>
//     set({
//       unreadCount: count,
//     }),
// }));

import { create } from "zustand";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  metadata?: Record<string, any>;
  referenceId?: string;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;

  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),

  addNotification: (notification) =>
    set((state) => {
      const notifications = [notification, ...state.notifications];

      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      };
    }),
}));