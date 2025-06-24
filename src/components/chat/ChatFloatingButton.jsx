import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";

export default function ChatFloatingButton({ onClick, unreadCount = 0 }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  if (!isLoggedIn) return null;

  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 w-14 h-14 rounded-full z-50 shadow-lg
        flex items-center justify-center transition-colors duration-200
        bg-white text-black hover:bg-gray-200
        dark:bg-black dark:text-white dark:hover:bg-[#1a1e24]
      `}
    >
      <MessageSquare className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="
          absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full 
          px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center
        ">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
