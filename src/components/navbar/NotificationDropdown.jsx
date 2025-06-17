import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/apiRoutes/routes";
import { NOTIFICATIONS } from "@/constants/apiRoutes/notifications";

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

      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));

      navigate(link);
      setShowDropdown(false);
    } catch (err) {
      console.error("Failed to resolve notification link", err);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button onClick={() => setShowDropdown((prev) => !prev)} className="relative mt-1">
        <Bell className="text-white translate-y-[1px]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-xs rounded-full px-1.5">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-[#1a1c1f] border border-gray-700 rounded shadow z-50">
          {/* Header */}
          <div className="p-3 text-white font-semibold border-b border-gray-600">
            Notifications
            <button
              onClick={markAllAsRead}
              className="text-xs float-right text-blue-400 hover:underline"
            >
              Mark all as read
            </button>
          </div>

          {/* Scrollable notification list */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-3 text-gray-400">No notifications</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.notificationId}
                  onClick={() => handleNavigate(n.notificationId)}
                  className={`px-4 py-3 border-b border-gray-700 text-sm hover:bg-gray-800 cursor-pointer transition ${
                    !n.isRead ? "bg-[#2c2f34]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full border border-gray-500 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${n.sender.profileImage?.imageUrl})`,
                        backgroundPosition: `${n.sender.profileImage?.imagePositionX ?? 50}% ${n.sender.imageDTO?.imagePositionY ?? 50}%`,
                      }}
                    ></div>
                    <div className="text-white">{n.message}</div>
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {new Date(n.createdAt).toLocaleString()}
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
