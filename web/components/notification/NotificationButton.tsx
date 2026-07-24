// src/components/header/NotificationButton.tsx

import { Bell } from "lucide-react";
import { useState } from "react";
import NotificationPopup from "./NotificationPopup";
import { useNotificationStore } from "@/store/notification.store";

const NotificationButton = () => {
  const [open, setOpen] = useState(false);

  const unreadCount = useNotificationStore((state) => state.unreadCount);
  //   console.log("unreadCount", unreadCount);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
      >
        <Bell size={22} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
            {unreadCount >99 ? "99+" : unreadCount > 9 ? "9+" : unreadCount}
            {/* {unreadCount > 99 ? "99+" : unreadCount} */}
          </span>
        )}
      </button>

      {open && <NotificationPopup closePopup={() => setOpen(false)} />}
    </div>
  );
};

export default NotificationButton;
