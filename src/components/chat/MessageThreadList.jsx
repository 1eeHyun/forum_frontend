import { useContext } from "react";
import { ChatContext } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import {
  getRelativeTime,
  getLastMessageAndTime,
  getUnreadCount,
} from "@/utils/chat";

export default function MessageThreadList({ onSelectThread }) {
  const { threads } = useContext(ChatContext);
  const { username: currentUsername } = useAuth();

  return (
    <div className="overflow-auto">
      {threads.map((thread) => {
        const { content, time } = getLastMessageAndTime(thread);
        const unreadCount = getUnreadCount(thread, currentUsername);

        return (
          <div
            key={thread.roomId}
            onClick={() => onSelectThread(thread.roomId)}
            className="
              flex items-center gap-3 p-3 cursor-pointer transition rounded-xl
              hover:bg-gray-200 dark:hover:bg-[#1a1e24]
              bg-white dark:bg-transparent
            "
          >
            <img
              src={thread.user.imageDto?.imageUrl || "/default.png"}
              onError={(e) => { e.target.src = "/default.png"; }}
              className="w-10 h-10 rounded-full object-cover"
              alt="profile"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-medium text-sm text-black dark:text-white truncate">
                  {thread.user.nickname}
                </p>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {getRelativeTime(time)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
