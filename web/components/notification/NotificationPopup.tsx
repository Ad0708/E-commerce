"use client";

import {
  useInfiniteNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useDeleteNotification,
} from "@/hooks/notification/useNotification";
import { Bell, Trash2, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/notification.store";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  closePopup: () => void;
}

const NotificationPopup = ({ closePopup }: Props) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check screen width dynamically on the client
  useEffect(() => {
    setMounted(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is the 'md' Tailwind breakpoint
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteNotifications(10);

  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  const setNotifications = useNotificationStore(
    (state) => state.setNotifications
  );

  useEffect(() => {
    setNotifications(notifications);
  }, [notifications, setNotifications]);

  // Close when clicking outside (Desktop only)
  useEffect(() => {
    if (isMobile) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        closePopup();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closePopup, isMobile]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 20) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  if (!mounted) return null;

  // The Actual Component Markup
  const popupContent = (
    <>
      {/* Dimmed Overlay: Only renders and acts as close mechanism on mobile viewports */}
      {isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]" 
          onClick={closePopup}
        />
      )}

      <div
        ref={popupRef}
        className={`
          border border-gray-200 dark:border-zinc-800
          bg-white dark:bg-zinc-950
          shadow-2xl flex flex-col overflow-hidden
          
          ${isMobile 
            ? "fixed bottom-0 left-0 right-0 max-h-[85vh] w-full rounded-t-2xl z-[1000]" 
            : "absolute right-0 top-12 w-96 max-h-[500px] rounded-xl z-50"
          }
        `}
      >
        {/* Visual drag bar indicator for mobile layout */}
        {isMobile && (
          <div className="w-12 h-1 bg-gray-300 dark:bg-zinc-700 rounded-full mx-auto my-2 flex-shrink-0" />
        )}

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 px-4 pb-4 pt-2 md:py-4 flex-shrink-0">
          <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Bell size={18} className="text-blue-500" />
            <h3 className="font-bold text-base md:text-sm">Notifications</h3>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => markAllRead()} 
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Mark all read
            </button>
            {isMobile && (
              <button 
                onClick={closePopup}
                className="p-1.5 rounded-lg bg-gray-50 dark:bg-zinc-900 text-gray-500 dark:text-gray-400"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Notification List Panel */}
        <div 
          onScroll={handleScroll} 
          className="overflow-y-auto flex-1 divide-y divide-gray-100 dark:divide-zinc-900 pb-6 md:pb-0"
        >
          {isLoading && (
            <p className="p-8 text-center text-sm text-gray-500 dark:text-gray-400 animate-pulse">
              Loading notifications...
            </p>
          )}

          {!isLoading && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center text-gray-400 dark:text-gray-500">
              <Bell size={36} className="stroke-1 mb-2 opacity-40" />
              <p className="text-sm">All caught up!</p>
            </div>
          )}

          {notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => {
                if (!notification.isRead) {
                  markRead(notification._id);
                }
                if (notification.link) {
                  router.push(notification.link);
                  closePopup();
                }
              }}
              className={`
                group flex items-start justify-between gap-3 p-4 cursor-pointer transition-colors
                ${!notification.isRead 
                  ? "bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-100/50 dark:hover:bg-blue-950/30" 
                  : "bg-white dark:bg-zinc-950 hover:bg-gray-50 dark:hover:bg-zinc-900/40"
                }
              `}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                      {notification.title}
                    </h4>
                    {!notification.isRead && (
                      <span className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-500 dark:bg-blue-400" />
                    )}
                  </div>
                  
                  {notification.createdAt && (
                    <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap pt-0.5">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {notification.message}
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {notification.metadata?.orderId && (
                    <span className="bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-[11px] font-mono text-gray-600 dark:text-gray-400">
                      ID: {notification.metadata.orderId}
                    </span>
                  )}

                  {notification.link && (
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform duration-150">
                      View details →
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification._id);
                }}
                className="
                  rounded-lg p-2 text-gray-400 dark:text-gray-500 
                  hover:bg-red-50 dark:hover:bg-red-950/40 
                  hover:text-red-600 dark:hover:text-red-400 
                  opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity
                "
                aria-label="Delete notification"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {isFetchingNextPage && (
            <p className="p-4 text-center text-xs font-medium text-gray-400 dark:text-gray-500">
              Loading older notifications...
            </p>
          )}
        </div>
      </div>
    </>
  );

  // Return Portal structure if on mobile view, otherwise inject standard inline node structure
  return isMobile ? createPortal(popupContent, document.body) : popupContent;
};

export default NotificationPopup;