import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { NOTIFICATIONS } from "@/constants/apiRoutes/notifications";
import {ROUTES} from "@/constants/apiRoutes/routes"

export default function NotificationDropdown({ token }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { method, url } = NOTIFICATIONS.LIST;
        const res = await axios({ method, url });
        const data = res.data.data;
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    if (token) fetchNotifications();
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    try {
      const { method, url } = NOTIFICATIONS.MARK_ALL_READ;
      await axios({ method, url });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleNavigate = async (notificationId) => {
    try {
      const { method, url } = NOTIFICATIONS.RESOLVE(notificationId);
      const res = await axios({ method, url });
      const link = res.data.data.link;      

      navigate(link);

      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
      setShowDropdown(false);
    } catch (err) {
      console.error("Failed to resolve notification link", err);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        className="relative p-2 mt-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <Bell className="text-black dark:text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-xs text-white rounded-full px-1.5">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-card-bg border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="p-4 text-sm font-semibold border-b border-gray-200 dark:border-gray-700 text-black dark:text-white flex justify-between items-center">
            Notifications
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-500 hover:underline"
            >
              Mark all as read
            </button>
          </div>

          {/* Scrollable List */}
          <div className="max-h-96 overflow-y-auto bg-white dark:bg-dark-card-bg">
            {notifications.length === 0 ? (
              <div className="p-4 text-gray-500 dark:text-gray-400 text-sm text-center">
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.notificationId}
                  onClick={() => handleNavigate(n.notificationId)}
                  className={`px-4 py-3 text-sm border-b border-gray-100 dark:border-gray-700 cursor-pointer transition ${
                    !n.isRead
                      ? "bg-gray-100 dark:bg-gray-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${n.sender.profileImage?.imageUrl})`,
                        backgroundPosition: `${n.sender.profileImage?.imagePositionX ?? 50}% ${n.sender.profileImage?.imagePositionY ?? 50}%`,
                      }}
                    ></div>
                    <div className="flex-1">
                      <p className="text-black dark:text-white">{n.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
